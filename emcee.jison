%{
    const path = require("path");
    const { generateNode } = require(path.normalize("../../../ast.js"))
    const {
      appendChild, prependChild, appendNodeChild
    } = require(path.normalize("../../../utils.js"));
%}

%lex

%%

\s+                   /* skip whitespace */
"int"                 return "INT";
"void"                return "VOID";
"double"              return "DOUBLE";
"string"              return "STRING";
"bool"                return "BOOL";
"return"              return "RETURN";
"if"                  return "IF";
"else"                return "ELSE";
"while"               return "WHILE";
"true"                return "TRUE"
"false"               return "FALSE"
[a-zA-Z][a-zA-Z0-9_]* return "ID";
[0-9]+"."[0-9]+\b     return "DOUBLEVALUE";
[0-9]+                return "INTVALUE";
"("                   return "PAROPEN";
")"                   return "PARCLOSE";
"{"                   return "BRACEOPEN";
"}"                   return "BRACECLOSE";
"["                   return "SBOPEN";
"]"                   return "SBCLOSE";
";"                   return "SEMICOLON";
","                   return "COMMA";
"=="                  return "EQ";
"="                   return "EQUALSSIGN";
"+"                   return "PLUS";
"-"                   return "MINUS";
"*"                   return "MULTIPLY";
">"                   return "GT";
"<"                   return "LT";
"!"                   return "NOT";
"//".*\n              /* skip comment */
"/"                   return "DIVIDE";
\"[^"]+\"             return "STR_VALUE";
/lex

%left EQ GT LT PLUS MINUS NOT
%left MULTIPLY DIVIDE

%%

pgm
    : pgm_block
      {return generateNode({nodeType: "root", children: $1});}
    ;

pgm_block
    : assgnmt_stmt
      {$$ = [$1]}
    | assgnmt_stmt pgm_block
      {$$ = prependChild($2, $1);}
    | function
      {$$ = [$1]}
    | function pgm_block
      {$$ = prependChild($2, $1);}
    | block
    ;

function
    : type id PAROPEN arglist PARCLOSE BRACEOPEN block BRACECLOSE
      {$$ = generateNode({nodeType: "function", children: $7, id: $2,
         meta: {returnType: $1, argList: $4}, info: @1});}
    ;

type
    : array
    | INT
    | VOID
    | DOUBLE
    | STRING
    | BOOL
    ;

array
    : type SBOPEN SBCLOSE
      {$$ = "array_" + $1;}
    ;

arglist
    : arg
      {$$ = [$1];}
    | arg COMMA arglist
      {$$ = prependChild($3, $1);}
    | %empty
      {$$ = []}
    ;

arg
    : type id
      {$$ = generateNode({nodeType: "argument", id: $2, meta: {valueType: $1}});}
    ;

id
    : ID
    ;

block
    : stmt
      {$$ = [$1];}
    | stmt block
      {$$ = prependChild($2, $1);}
    | return
      {$$ = [$1];}
    ;

return
    : RETURN expr SEMICOLON
      {$$ = generateNode({nodeType: "return", children: [$2]});}
    | RETURN SEMICOLON
      {$$ = generateNode({nodeType: "return", children: [$2]});}
    ;

stmt
    : fn_call SEMICOLON
    | assgnmt_stmt SEMICOLON
    | if
    | while
    ;

while
    : WHILE PAROPEN expr PARCLOSE BRACEOPEN block BRACECLOSE
      {$$ = generateNode({nodeType: "while", children: [$3, $6], info: @1});}
    ;

fn_call
    : id PAROPEN paramlist PARCLOSE
      {$$ = generateNode({
         nodeType: "function_call", children: $3, id: $1, info: @1});}
    ;

if
    : IF PAROPEN expr PARCLOSE BRACEOPEN block BRACECLOSE
      ELSE BRACEOPEN block BRACECLOSE
      {$$ = generateNode({nodeType: "if", children: [$3, $6, $10], info: @1});}
    | IF PAROPEN expr PARCLOSE BRACEOPEN block BRACECLOSE
      {$$ = generateNode({nodeType: "if", children: [$3, $6], info: @1});}
    ;

paramlist
    : expr
      {$$ = [$1];}
    | expr COMMA paramlist
      {$$ = prependChild($3, $1);}
    | %empty
      {$$ = [];}
    ;

expr
    : id
      {$$ = generateNode({nodeType: "symbol", id: $1, info: @1})}
    | value
    | PAROPEN expr PARCLOSE
      {$$ = $2;}
    | expr EQ expr
      {$$ = generateNode({nodeType: "compare_eq", children: [$1, $3]});}
    | expr GT expr
      {$$ = generateNode({nodeType: "compare_gt", children: [$1, $3]});}
    | expr LT expr
      {$$ = generateNode({nodeType: "compare_lt", children: [$1, $3]});}
    | expr MULTIPLY expr
      {$$ = generateNode({nodeType: "mul_expr", children: [$1, $3]});}
    | expr DIVIDE expr
      {$$ = generateNode({nodeType: "div_expr", children: [$1, $3]});}
    | expr PLUS expr
      {$$ = generateNode({nodeType: "add_expr", children: [$1, $3]});}
    | expr MINUS expr
      {$$ = generateNode({nodeType: "sub_expr", children: [$1, $3]});}
    | fn_call
    | id SBOPEN expr SBCLOSE
      {$$ = generateNode({
         nodeType: "array_access",
         id: $1,
         children: [$1, $3]});}
    | NOT expr
      {$$ = generateNode({nodeType: "not", children: [$2], info: @1})}
    ;

assgnmt_stmt
    : id EQUALSSIGN expr
      {$$ = generateNode({
         nodeType: "assignment",
         children: [$1, $3], id: $1,
         info: @1});}
    | type id EQUALSSIGN expr
      {$$ = generateNode({
        nodeType: "assignment",
        children: [$2, $4],
        id: $2,
        meta: {valueType: $1},
        info: @1});}
    ;

value
    : INTVALUE
      {$$ = generateNode({
         nodeType: "integer_value",
         children: [$1],
         info: @1})}
    | DOUBLEVALUE
      {$$ = generateNode({nodeType: "double_value", children: [$1]})}
    | STR_VALUE
      {$$ = generateNode({nodeType: "string_value", children: [$1]})}
    | SBOPEN value_list SBCLOSE
      {$$ = generateNode({nodeType: "array_values", children: $2});}
    | TRUE
      {$$ = generateNode({nodeType: "boolean_value", children: [$1]})}
    | FALSE
      {$$ = generateNode({
         nodeType:
         "boolean_value",
         children: [$1],
         info: @1})}
    ;

value_list
    : %empty
      {$$ = [];}
    | value
      {$$ = [$1];}
    | value COMMA value_list
      {$$ = prependChild($3, $1);}
    ;