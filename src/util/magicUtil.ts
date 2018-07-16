export namespace constants {
    export const wordRange = /[A-Za-z\d.]+/;

    export const macroPrefix = /^(?:#|\[\d+]::)?/;
    export const macroRange = /[A-Z\d.]+/;
    export const macroDefinitionRange = new RegExp(`${macroPrefix.source}(${macroRange.source})$`);
}
