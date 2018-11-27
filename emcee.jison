%{
    const path = require("path");
    const {
      createNode, appendChild, prependChild, appendNodeChild
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
"//".*\n              /* skip comment */
"/"                   return "DIVIDE";
\"[^"]+\"             return "STR_VALUE";
/lex

%left EQ GT LT PLUS MINUS
%left MULTIPLY DIVIDE

%%

pgm
    : pgm_block
      {return createNode("root", $1);}
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
    ;

function
    : type id PAROPEN arglist PARCLOSE BRACEOPEN block BRACECLOSE
      {$$ = createNode("function", $7, $2,
         {returnType: $1, argList: $4});}
    ;

type
    : INT
    | VOID
    | DOUBLE
    | STRING
    | BOOL
    | array
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
    : type
      {$$ = createNode("argument", [], null, {valueType: $1});}
    | type id
      {$$ = createNode("argument", [], $2, {valueType: $1});}
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
      {$$ = createNode("return", [$2]);}
    | RETURN SEMICOLON
      {$$ = createNode("return", [$2]);}
    ;

stmt
    : fn_call SEMICOLON
    | assgnmt_stmt SEMICOLON
    | if
    | while
    ;

while
    : WHILE PAROPEN expr PARCLOSE BRACEOPEN while_body BRACECLOSE
      {$$ = createNode("while", [$3, $6]);}
    ;

while_body
    : block
      {$$ = createNode("while_body", $1);}
    ;

fn_call
    : id PAROPEN paramlist PARCLOSE
      {$$ = createNode("function_call", $3, $1);}
    ;

if
    : IF PAROPEN expr PARCLOSE BRACEOPEN block BRACECLOSE
      {$$ = createNode("if", [$3, createNode("if_body", $6)]);}
    | if ELSE BRACEOPEN block BRACECLOSE
      {$$ = appendNodeChild($1, createNode("else_body", $4));}
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
    | value
    | PAROPEN expr PARCLOSE
    | expr EQ expr
      {$$ = createNode("compare_eq", [$1, $3]);}
    | expr GT expr
      {$$ = createNode("compare_gt", [$1, $3]);}
    | expr LT expr
      {$$ = createNode("compare_lt", [$1, $3]);}
    | expr MULTIPLY expr
    | expr DIVIDE expr
    | expr PLUS expr
    | expr MINUS expr
    | fn_call
    | id SBOPEN expr SBCLOSE
    ;

assgnmt_stmt
    : id EQUALSSIGN expr
      {$$ = createNode("assignment", [$1, $3], $1);}
    | type id EQUALSSIGN expr
      {$$ = createNode("assignment", [$2, $4], $2, {valueType: $1});}
    ;

value
    : INTVALUE
    | DOUBLEVALUE
    | STR_VALUE
    | array_value
    ;

array_value
    : SBOPEN value_list SBCLOSE
      {$$ = createNode("array_values", $2);}
    ;

value_list
    : %empty
      {$$ = [];}
    | value
      {$$ = [$1];}
    | value COMMA value_list
      {$$ = prependChild($3, $1);}
    ;