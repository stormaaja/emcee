%{
    const path = require("path");
    const {
      createNode, appendChild, appendNodeChild
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
[0-9]+                return "NATLITERAL";
"("                   return "PAROPEN";
")"                   return "PARCLOSE";
"{"                   return "BRACEOPEN";
"}"                   return "BRACECLOSE";
"["                   return "SBOPEN";
"]"                   return "SBCLOSE";
";"                   return "SEMICOLON";
","                   return "COMMA";
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

%left GT LT PLUS MINUS
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
      {$$ = appendChild($2, $1);}
    | function
      {$$ = [$1]}
    | function pgm_block
      {$$ = appendChild($2, $1);}
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
    ;

arglist
    : arg
      {$$ = [$1];}
    | arg COMMA arglist
      {$$ = appendChild($2, $1);}
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
      {$$ = appendChild($2, $1);}
    | return
      {$$ = [$1];}
    ;

return
    : RETURN expr SEMICOLON
      {$$ = createNode("return", [], null, {}, $2);}
    | RETURN SEMICOLON
      {$$ = createNode("return", [], null, {});}
    ;

stmt
    : fn_call SEMICOLON
    | assgnmt_stmt SEMICOLON
    | if
    | while
    ;

while
    : WHILE PAROPEN expr PARCLOSE BRACEOPEN block BRACECLOSE
    ;

fn_call
    : id PAROPEN paramlist PARCLOSE
      {$$ = createNode("function_call", [], $1,
          {paramList: $3});}
    ;

if
    : IF PAROPEN expr PARCLOSE BRACEOPEN block BRACECLOSE
      {$$ = createNode("if", $6, null, {}, $3);}
    | if ELSE BRACEOPEN block BRACECLOSE
      {$$ = appendNodeChild($1, $4);}
    ;

paramlist
    : expr
    | expr COMMA paramlist
      {$$ = appendChild($2, $1);}
    | %empty
    ;

expr
    : id
    | value
    | PAROPEN expr PARCLOSE
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
    | type id EQUALSSIGN expr
    ;

value
    : NATLITERAL
    | STR_VALUE
    | array_value
    ;

array_value
    : SBOPEN value_list SBCLOSE
    ;

value_list
    : %empty
      {$$ = [];}
    | value
      {$$ = [$1];}
    | value COMMA value_list
      {$$ = appendChild($2, $1);}
    ;