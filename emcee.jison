%lex

%%

\s+                   /* skip whitespace */
"int"                 return "INT";
"void"                return "VOID";
"double"              return "DOUBLE";
"string"              return "STRING";
"bool"                return "BOOL";
"return"              return "RETURN";
[a-zA-Z][a-zA-Z0-9_]*  return "ID";
[0-9]+                return "NATLITERAL";
"("                   return "PAROPEN";
")"                   return "PARCLOSE";
"{"                   return "BRACEOPEN";
"}"                   return "BRACECLOSE";
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
    ;

pgm_block
    : assgnmt_stmt
    | pgm_block assgnmt_stmt
    | function
    | pgm_block function
    ;

function
    : type id PAROPEN arglist PARCLOSE BRACEOPEN
        block
      BRACECLOSE
    ;

type
    : INT
    | VOID
    | DOUBLE
    | STRING
    | BOOL
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
    | stmt block
    | return
    ;

return
    : RETURN expr SEMICOLON
    | RETURN SEMICOLON
    ;

stmt
    : fn_call SEMICOLON
    | assgnmt_stmt SEMICOLON
    | if
    ;

fn_call
    : id PAROPEN paramlist PARCLOSE
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
    | expr MULTIPLY expr
    | expr DIVIDE expr
    | expr PLUS expr
    | expr MINUS expr
    | fn_call
    ;

assgnmt_stmt
    : id EQUALSSIGN expr
    | type id EQUALSSIGN expr
    ;

value
    : NATLITERAL
    | STR_VALUE
    ;