var cenaMin,cenaMax,powierzchnaiMin,powierzchniaMax,wojewodztwo,typDomu,typSprzedazy;
//class Oferta {
//    constructor(cenaMin)
//}

// funkcja odczytDanych przypisuje zmiennym wartosci podane przez uzytkownika na stronie
function odczytDanych(){

 cenaMin = document.getElementById("cenaMinimalna").value;
 cenaMax = document.getElementById("cenaMaksymalna").value;
 powierzchnaiMin = document.getElementById("powierzchniaMinimalna").value;
 powierzchniaMax = document.getElementById("powierzchniaMaksymalna").value;
 wojewodztwo = document.getElementById("wybraneWojewodztwo").value;
 typSprzedazy = document.querySelector('input[name="TypSprzedazy"]:checked').value;
 typDomu = document.querySelector('input[name="TypDomu"]:checked').value;

console.log(wojewodztwo);  
console.log(typSprzedazy);
console.log(typDomu); 
window.location.href = 'output.html';

}