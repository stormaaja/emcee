%lex

%%

\s+                   /* skip whitespace */
"int"                 return "INT";
"void"                return "VOID";
"return"              return "RETURN";
[a-zA-Z][a-zA-Z0-9]*  return "ID";
[0-9]+                return "NATLITERAL";
"("                   return "PAROPEN";
")"                   return "PARCLOSE";
"{"                   return "BRACEOPEN";
"}"                   return "BRACECLOSE";
";"                   return "SEMICOLON";
/lex

%%

pgm
    : function
    ;

function
    : fndecl BRACEOPEN return BRACECLOSE
    ;

fndecl
    : type id PAROPEN arglist PARCLOSE
    ;

type
    : INT
    | VOID
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

return
    : RETURN return_value SEMICOLON
    ;

return_value
    : expr
    ;

expr
    : NATLITERAL
    ;