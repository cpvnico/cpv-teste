
function enableButton() {
  // Selecionar o botão
  const botao = document.getElementById('botao');
  // Ativar o botão
  botao.disabled = false;
}

const botao = document.querySelector('.meu-botao1');
    
    botao.addEventListener('click', () => {
      botao.classList.toggle('ativo');
      setTimeout(() => {
        botao.classList.toggle('ativo');
      }, 1500); // Tempo igual ao tempo de transição em segundos
    });

$(document).ready(function(){
  // Ativar/desativar a edição do input quando a página é carregada
  toggleInput();

  // Ativar/desativar a edição do input quando o switch é clicado
  $("#disableInput").on("change", function() {
      toggleInput();
  });

  // Aplicar a máscara de data e hora enquanto o usuário digita
  $("#dataehora").inputmask('99/99/9999 99:99:99', {
      placeholder: 'DD/MM/YYYY HH:mm:ss',
      clearIncomplete: true
  });

  // Aplicar a máscara de data enquanto o usuário digita
  $("#datepag").inputmask('99/99/9999', {
      placeholder: 'DD/MM/YYYY',
      clearIncomplete: true
  });
});

$(document).ready(function() {
  $("#barcode").on("input", function() {
    // Permitir apenas números e espaço
    var regex = /[^0-9 ]/g;
    $(this).val($(this).val().replace(regex, ""));
  });
});

const generateSerial = () => {
  // Gerando 16 dígitos aleatórios
  const randomDigits = Math.floor(Math.random() * 10 ** 16).toString(10).padStart(16, "0");

  // Concatenando "G" com os dígitos aleatórios
  return `G${randomDigits}`;
};

function toggleInput() {
  const now = new Date();
  const formattedDateTime = now.toLocaleDateString() + " " + now.toLocaleTimeString();
  const formattedDate = now.toLocaleDateString();

  if ($("#disableInput").is(":checked")) {
      // Adicionar 1 minuto ao valor atual nos minutos
      now.setMinutes(now.getMinutes() + 2);
      const formattedDateTimeWithMinutes = now.toLocaleDateString() + " " + now.toLocaleTimeString();
      $("#dataehora").val(formattedDateTimeWithMinutes);
      $("#dataehora").prop("disabled", true);

      // Definir a data atual no input
      $("#datepag").val(formattedDate);
      $("#datepag").prop("disabled", true);
  } else {
      // Definir a data e hora atual no input
      $("#dataehora").val(formattedDateTime);
      $("#dataehora").prop("disabled", false);

      // Definir a data atual no input
      $("#datepag").val(formattedDate);
      $("#datepag").prop("disabled", false);
  }
}


$(document).ready(function() {
  // Exibir "0,00" no campo Valor quando a página for carregada
  $("#Valor").val("0,00");

  $(".Valor").maskMoney({
    thousands: '.',
    decimal: ',',
    allowZero: true,
    precision: 2,
    allowNegative: false
  });
});

const { PDFDocument, rgb, StandardFonts } = PDFLib;

document.getElementById("botao").addEventListener("click", () => {
  // Gerando um novo valor para a constante serial
  const newSerial = generateSerial();

  // Atualizando o valor da constante serial
  serial = newSerial;

  // Exibindo o novo valor da constante serial
  console.log(serial); // Ex: G9876543210123456

  // Atualizando o valor da constante serial na tela
  document.getElementById("valorSerial").textContent = serial;
});

async function modifyPdf() {
    const serial = generateSerial();
    const dataehora = document.getElementById('dataehora').value;
    let barcode = document.getElementById('barcode').value;
    const datepag = document.getElementById('datepag').value;
    const Valor = document.getElementById('Valor').value;

    // Fetch um documento PDF existente
    const url = './assets/CPV.pdf';
    const existingPdfBytes = await fetch(url).then(res => res.arrayBuffer());

    // Carregar um PDFDocument a partir dos bytes do PDF existente
    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    // Incorporar a fonte Helvetica
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // Obter a primeira página do documento
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    // Obter a largura do texto inserido para o Terceiro Valor
    const serialWidth = helveticaFont.widthOfTextAtSize(serial, 8.25);
    // Calcular a posição X para o Terceiro Valor
    const serialXPosition = 560 - serialWidth;

    // Obter a largura do texto inserido para o Outro Valor
    const dataehoraWidth = helveticaFont.widthOfTextAtSize(dataehora, 8.25);
    // Calcular a posição X para o Outro Valor
    const dataehoraXPosition = 560 - dataehoraWidth;

    // Remover espaço do final do valor, se houver
    barcode = barcode.replace(/[^0-9\s]/g, '');
    barcode = barcode.replace(/\s+$/, '');

    // Obter a largura do texto inserido para o Terceiro Valor
    const barcodeWidth = helveticaFont.widthOfTextAtSize(barcode, 8.25);
    // Calcular a posição X para o Terceiro Valor
    const barcodeXPosition = 560 - barcodeWidth;

    // Obter a largura do texto inserido para o Quarto Valor
    const datepagWidth = helveticaFont.widthOfTextAtSize(datepag, 8.25);
    // Calcular a posição X para o Quarto Valor
    const datepagXPosition = 560 - datepagWidth;

    // Obter a largura do texto inserido para o Quinto Valor
    const ValorWidth = helveticaFont.widthOfTextAtSize(Valor, 8.25);
    // Calcular a posição X para o Quinto Valor
    const ValorXPosition = 560 - ValorWidth;

    // Desenhar uma string de texto na primeira página para o serial
    firstPage.drawText(serial, {
      x: serialXPosition,
      y: 789,
      size: 8.25,
      font: helveticaFont,
      color: rgb(0, 0, 0),
    });

    // Desenhar uma string de texto na primeira página para o Outro Valor
    firstPage.drawText(dataehora, {
      x: dataehoraXPosition,
      y: 780,
      size: 8.25,
      font: helveticaFont,
      color: rgb(0, 0, 0),
    });

    // Desenhar uma string de texto na primeira página para o Terceiro Valor
    firstPage.drawText(barcode, {
      x: barcodeXPosition,
      y: 699,
      size: 8.25,
      font: helveticaFont,
      color: rgb(0, 0, 0),
    });

    // Desenhar uma string de texto na primeira página para o Quarto Valor
    firstPage.drawText(datepag, {
      x: datepagXPosition,
      y: 687,
      size: 8.25,
      font: helveticaFont,
      color: rgb(0, 0, 0),
    });

    // Desenhar uma string de texto na primeira página para o Quinto Valor
    firstPage.drawText(Valor, {
      x: ValorXPosition,
      y: 676,
      size: 8.25,
      font: helveticaFont,
      color: rgb(0, 0, 0),
    });

    // Serializar o PDFDocument para bytes (Uint8Array)
    const pdfBytes = await pdfDoc.save();

    // Acionar o download do documento PDF no navegador
    download(pdfBytes, "CPV.pdf", "application/pdf");
}