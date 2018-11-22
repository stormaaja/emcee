%lex

%%

\s+                   /* skip whitespace */
"int"                 return "INT";
"void"                return "VOID";
"double"              return "DOUBLE"
"return"              return "RETURN";
[a-zA-Z][a-zA-Z0-9]*  return "ID";
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
"//".*\n              /* skip comment */
"/"                   return "DIVIDE";
\"[^"]+\"             return "STR_VALUE";
/lex

%left PLUS MINUS
%left MULTIPLY DIVIDE

%%

pgm
    : assgnmt_stmt
    | function
    ;

function
    : type id PAROPEN arglist PARCLOSE BRACEOPEN
        block
        return
      BRACECLOSE
    ;

type
    : INT
    | VOID
    | DOUBLE
    ;

arglist
    : arg
    | arg COMMA arglist
    ;

arg
    : type
    | type id
    ;

id
    : ID
    ;

block
    : stmt SEMICOLON
    | stmt SEMICOLON block
    ;

return
    : RETURN expr SEMICOLON
    | RETURN SEMICOLON
    | %empty
    ;

stmt
    : fn_call
    | assgnmt_stmt
    ;

fn_call
    : id PAROPEN paramlist PARCLOSE
    ;

paramlist
    : param
    | param COMMA paramlist
    ;

param
    : STR_VALUE
    | id
    ;

expr
    : id
    | value
    | PAROPEN expr PARCLOSE
    | expr MULTIPLY expr
    | expr DIVIDE expr
    | expr PLUS expr
    | expr MINUS expr
    ;

assgnmt_stmt
    : id EQUALSSIGN expr
    | type id EQUALSSIGN expr
    ;

value
    : NATLITERAL
    | STR_VALUE
    ;