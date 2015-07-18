module Humanizer.Localisation.NumberToWords
{
    "use strict";

    interface ExceptionsDictionary
    {
        [num: number]: string;
    }

    var unitsMap = [
        "cero", "uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve",
        "diez", "once", "doce", "trece", "catorce", "quince", "dieciséis", "diecisiete", "dieciocho", "diecinueve",
        "veinte", "veintiuno", "veintidós", "veintitrés", "veinticuatro", "veinticinco", "veintiséis", "veintisiete", "veintiocho", "veintinueve"];
    var tensMap = ["cero", "diez", "veinte", "treinta", "cuarenta", "cincuenta", "sesenta", "setenta", "ochenta", "noventa"];
    var hundredsMap = ["cero", "ciento", "doscientos", "trescientos", "cuatrocientos", "quinientos", "seiscientos", "setecientos", "ochocientos", "novecientos"];

    function getUnitValue(num: number, isOrdinal: boolean): string
    {
        if (isOrdinal)
        {
            throw 'ordinal numbers for Spanish are not implemented';
        }
        else
        {
            return unitsMap[num];
        }
    }

    function removeOnePrefix(toWords: string): string
    {
        if (toWords.indexOf("one") === 0)
        {
            return toWords.substr(4);
        }
        return toWords;
    }

    function convert(num: number, isOrdinal: boolean): string
    {
         if (num === 0) {
            return "cero";
        }

        if (num < 0) {
            return "menos " + convert(Math.abs(num));
        }

        var parts: string[] = [];

        if (Math.floor(num / 1000000000) > 0) {
            parts.push(Math.floor(num / 1000000000) === 1
                ? "mil millones"
                : convert(Math.floor(num / 1000000000)) + "mil millones");

            num %= 1000000000;
        }

        if (Math.floor(num / 1000000) > 0) {
            parts.push(Math.floor(num / 1000000) === 1
                ? "un millón"
                : convert(Math.floor(num / 1000000)) + " millones");

            num %= 1000000;
        }

        if (Math.floor(num / 1000) > 0) {
            parts.push(Math.floor(num / 1000) === 1
                ? "mil"
                : convert(Math.floor(num / 1000)) + " mil");

            num %= 1000;
        }

        if (Math.floor(num / 100) > 0) {
            parts.push(num === 100 ? "cien" : hundredsMap[Math.floor(num / 100)]);
            num %= 100;
        }

        if (num > 0) {
            if (num < 30)
                parts.push(unitsMap[num]);
            else if (num > 20 && num < 30) {
                var lastPart = tensMap[Math.floor(num / 10)];
                if ((num % 10) > 0)
                    lastPart += " " + unitsMap[num % 10];

                parts.push(lastPart);
            }
            else {
                var lastPart = tensMap[Math.floor(num / 10)];
                if ((num % 10) > 0)
                    lastPart += " y " + unitsMap[num % 10];

                parts.push(lastPart);
            }
        }

        var result = parts.shift();

        parts.forEach(p => result += ' ' + p);

        return result;
    }

    export class SpanishNumberToWordsConverter extends GenderlessNumberToWordsConverter
    {
        convert_number(num: number): string
        {
            return convert(num, false);
        }

        convertToOrdinal_number(num: number): string
        {
            return convert(num, true);
        }
    }
} 
