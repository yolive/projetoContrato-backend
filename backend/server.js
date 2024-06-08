const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');

const app = express();
app.use(bodyParser.json());

const defaultEmail = 'mathbello@gmail.com'; // E-mail padrão para envio

async function gerarPdf(data) {
  try {
    console.log("Dados recebidos para gerar PDF:", data);
    
    const pdfDoc = await PDFDocument.create();
    let page = pdfDoc.addPage([595, 842]); // A4 size
    const font = await pdfDoc.embedFont(StandardFonts.TimesRoman);

    const maxTextWidth = 495; // Largura máxima do texto na página
    const lineHeight = 15; // Altura da linha
    let currentY = 800; // Posição Y inicial

    const drawText = (text) => {
      const textSize = font.widthOfTextAtSize(text, 10); // Largura do texto
      let numLines = Math.ceil(textSize / maxTextWidth); // Número de linhas necessárias

      // Verificar se há espaço suficiente na página
      if (currentY - lineHeight * numLines < 50) {
        page = pdfDoc.addPage([595, 842]); // Adicionar nova página
        currentY = 800; // Reiniciar a posição Y
      }

      // Verificar se o texto precisa ser quebrado em várias linhas
      let parts = [];
      if (textSize > maxTextWidth) {
        const words = text.split(' ');
        let line = '';
        for (const word of words) {
          if (font.widthOfTextAtSize(line + ' ' + word, 10) > maxTextWidth) {
            parts.push(line.trim());
            line = word;
          } else {
            line += ' ' + word;
          }
        }
        parts.push(line.trim());
        numLines = parts.length;
      } else {
        parts.push(text);
      }

      // Posicionar o texto na página
      for (let i = 0; i < numLines; i++) {
        page.drawText(parts[i], {
          x: 50,
          y: currentY - lineHeight * (i + 1),
          size: 10,
          font,
          color: rgb(0, 0, 0)
        });
      }

      // Atualizar a posição Y
      currentY -= lineHeight * numLines;
    };

    drawText('CONTRATO DE PRESTAÇÃO DE SERVIÇO');
    drawText('ESPACO NAJLA DE DANÇAS, empresa sediada à RUA Pastoril de Itapetinga, nº 502-sobreloja, JD DANFER, São Paulo, denominada Contratada');
    drawText('Nome: ' + (data.nome || 'Nome não informado'));
    drawText('CPF: ' + (data.cpf || 'CPF não informado'));
    drawText('Nascimento: ' + (data.dataNascimento || 'Nascimento não informado'));
    drawText('Responsável: ' + (data.responsavel || 'Responsável não informado'));
    drawText('Celular: ' + (data.celular || 'Celular não informado'));
    drawText(', aqui denominada Contratante ou Aluna (o) celebram entre si o presente contrato de prestação de serviço, nas seguintes condições:');
    drawText('1) O presente contrato tem por objeto a prestação de serviços pelo ESPACO NAJLA DE DANÇAS à Aluna (o) em sua especialidade profissional, ou seja, ministrar aulas de: ' + (data.opcoesAula || 'Especialidade não informada'));
    drawText('2) Em caso de falta, a Aluna (o) não terá direito a ressarcimentos de qualquer natureza, tais como devoluções de pagamentos vencidos ou cancelamento dos débitos a vencer.');
    drawText('3) O valor do presente contrato a ser pago pela Aluna (o) o ESPACO NAJLA DE DANÇAS referente às aulas do estágio constante na Cláusula 2, será de R$ ' + (data.valorMensalidade || 'Valor não informado'));
    drawText('Data de pagamento: ' + (data.dataPagamento || 'Data de pagamento não informada'));
    drawText('Forma de pagamento: ' + (data.formaPagamento || 'Forma de pagamento não informada'));
    drawText('4) O não recebimento dos valores da Cláusula 3 (três) impedirá a Aluna (O) de frequentar as aulas.');
    drawText('6) Para alteração em data ou troca de turma será cobrada uma taxa de serviço no valor de R$10,00 (dez reais), devendo tal procedimento ser solicitado');
    drawText('com no mínimo 10 (dez) dias de antecedência. É facultado à Aluna (o) transferir o saldo de seu plano a terceiros desde que os mesmos estejam cientes');
    drawText('dos termos deste contrato.');
    drawText('7) Caso a Aluna (o) queira rescindir este contrato antes do prazo estabelecido na Cláusula 02 (dois), arcará com uma multa em favor do ESPACO NAJLA');
    drawText('DE DANÇA S, equivalente a R$ 100,00 (cem reais).');
    drawText('8) O cancelamento deste contrato por parte da Aluna (o) só será aceito com pedido formal, devendo este ser efetuado com 20 (vinte) dias de antecedência');
    drawText('à data desejada do cancelamento.');
    drawText('9) Em caso de doença, comprovada por atestado, a Aluna (o) terá até 06 (seis) meses de carência para retornar às aulas. A Aluna (o) deverá informar por');
    drawText('escrito seu afastamento temporário. Ao retornar às aulas (desde que dentro de 06 (seis) meses da data do pedido de afastamento), a Aluna (o) poderá');
    drawText('frequentar as aulas sem nenhum ônus, durante as mesmas horas correspondentes às aulas perdidas.');
    drawText('10) O ESPACO NAJLA DE DANÇA não se responsabiliza pela guarda ou conservação de bens de propriedade da Aluna (o). A utilização dos armários');
    drawText('internos é de exclusiva responsabilidade da Aluna (o), a qual deverá usar para tal cadeado fornecido pela escola. Os armários são de uso exclusivo da');
    drawText('aluna (o) durante o período em que estiver em aula, devendo liberá-lo e entregar chave e cadeado na recepção da escola, ao término da aula.');
    drawText('11) Os pertences guardados e disponibilizados para retirada pelo seu dono serão de responsabilidade da Aluna (o). O ESPACO NAJLA DE DANÇA não se');
    drawText('responsabiliza por valores ou objetos pessoais perdidos ou subtraídos, sendo que o ESPACO NAJLA DE DANÇA recomenda não trazer objetos de valor nem');
    drawText('altas somas de dinheiro para as aulas.');
    drawText('12) A entrada e a permanência em sala de aula só serão permitidas à Aluna (o) devidamente inscrita (o) no ESPACO NAJLA DE DANÇA, exceto nos casos');
    drawText('em que haja expressa autorização da recepção.');
    drawText('13) Qualquer incidente físico que venha a ocorrer durante a prática das atividades de Dança não será de responsabilidade do ESPACO NAJLA DE DANÇA.');
    drawText('14) Para emissão de certificado referente ao estágio cursado, a Aluna (o) deverá frequentar 75% (setenta e cinco por cento) das aulas ministradas.');
    drawText('15) As não observâncias dos termos deste contrato bem como atos de vandalismo indisciplina ou comportamentos inadequados poderão acarretar a');
    drawText('exclusão do quadro de alunas (o), sem direito a ressarcimento de valores já pagos.');
    drawText('16) A Aluna (o) declara conhecer o presente termo e seu teor, concordar com as condições e ter recebido a oportunidade de freqüentar uma aula gratuita.');
    drawText('17) A Aluna (o) declara estar em perfeitas condições de saúde, conhecendo e assumindo todos os riscos advindos das atividades do curso.');
    drawText('18) É de direito do ESPACO NAJLA DE DANÇA a substituição de professoras, quando julgar necessário, sem aviso prévio à Aluna (o).');
    drawText('19) Este contrato é celebrado em caráter irretratável e irrevogável, ficando eleito O Tribunal Arbitral de São Paulo para dirimir quaisquer dúvidas daqui');
    drawText('oriundas, com renúncia expressa de qualquer outro, por mais privilegiado que seja.');
    drawText('E, por estarem assim justas e contratadas, cientes e de perfeito acordo com todas as condições do presente contrato, celebrado em duas vias de igual');
    drawText('teor e forma, dispensam as partes expressamente a presença das testemunhas instrumentárias e assinam este instrumento, para que possam produzir');
    drawText('os seus devidos e legais efeitos de direito.');


    const pdfBytes = await pdfDoc.save();
    console.log("PDF gerado com sucesso");
    
    return pdfBytes;
  } catch (error) {
    console.error("Erro ao gerar PDF:", error);
    throw error;
  }
}


app.post('/api/visualizar-pdf', async (req, res) => {
  try {
    const pdfBytes = await gerarPdf(req.body);
    res.contentType('application/pdf');
    res.send(Buffer.from(pdfBytes));
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).send('Error generating PDF');
  }
});


app.post('/api/enviar-pdf', async (req, res) => {
  try {
    // Gere o PDF
    const pdfBytes = await gerarPdf(req.body);

    // Configuração do nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'obellojoga@gmail.com', // Substitua pelo seu email
        pass: 'frmf ipai zylw evmz'   // Substitua pela sua senha
      }
    });

    // Opções do email
    const mailOptions = {
      from: 'obellojoga@gmail.com',
      to: defaultEmail,
      subject: 'Novo Contrato Preenchido',
      text: 'Segue em anexo o contrato preenchido.',
      attachments: [
        {
          filename: 'Contrato.pdf',
          content: pdfBytes,
          contentType: 'application/pdf'
        }
      ]
    };

    // Envio do email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).send(error.toString());
      }
      res.status(200).send({ message: 'PDF enviado com sucesso: ', info});
    });
  } catch (error) {
    res.status(500).send('Erro ao gerar ou enviar o PDF: ' + error.toString());
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
