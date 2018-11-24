%{
    const path = require("path");
    const {
      createNode, appendNode, createReturn, createFunction, createComparision,
      createFnCall
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
    | pgm_block assgnmt_stmt
      {$$ = appendNode($1, $2);}
    | function
    | pgm_block function
      {$$ = appendNode($1, $2);}
    ;

function
    : type id PAROPEN arglist PARCLOSE BRACEOPEN block BRACECLOSE
      {$$ = createFunction($7, $2, $1, $3);}
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
    | arg COMMA arglist
    | %empty
    ;

arg
    : type
    | type id
    ;

id
    : ID
    ;

block
    : stmt
      {$$ = [$1];}
    | stmt block
      {$$ = appendNode($2, $1);}
    | return
      {$$ = [$1];}
    ;

return
    : RETURN expr SEMICOLON
      {$$ = createNode("return", [], undefined, {}, $2);}
    | RETURN SEMICOLON
      {$$ = createNode("return", [], undefined, {});}
    ;

stmt
    : fn_call SEMICOLON
    | assgnmt_stmt SEMICOLON
    | if
    | while
    ;

while
    : WHILE PAROPEN expr PARCLOSE BRACEOPEN block BRACECLOSE
      {$$ = createNode("while", $6, undefined, {expr: $3});}
    ;

fn_call
    : id PAROPEN paramlist PARCLOSE
      {$$ = createFnCall($1, $3);}
    ;

if
    : IF PAROPEN expr PARCLOSE BRACEOPEN block BRACECLOSE
    | if ELSE BRACEOPEN block BRACECLOSE
    ;

paramlist
    : expr
    | expr COMMA paramlist
    | %empty
    ;

expr
    : id
    | value
    | PAROPEN expr PARCLOSE
    | expr GT expr
    | expr LT expr
      {$$ = createComparision("lt", $1, $3);}
    | expr MULTIPLY expr
    | expr DIVIDE expr
    | expr PLUS expr
    | expr MINUS expr
    | fn_call
    | id SBOPEN expr SBCLOSE
    ;

assgnmt_stmt
    : id EQUALSSIGN expr
      {$$ = createNode("assignment", [], $1, {value: $3});}
    | type id EQUALSSIGN expr
      {$$ = createNode("assignment", [], $2, {value: $4, type: $1});}
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
      {$$ = appendNode($3, $1);}
    ;