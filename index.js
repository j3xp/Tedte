const api_key = "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";
const { Configuration, OpenAIApi } = require("openai");
const venom = require('venom-bot')

const configuration = new Configuration({
  apiKey: api_key
});
const openai = new OpenAIApi(configuration);

const saudacoes = `Olá e bem-vindo ao nosso incrível ebook de dicas de emagrecimento saudável!

Estamos animados em tê-lo(a) aqui e prontos para ajudá-lo(a) a alcançar seus objetivos de forma saudável e sustentável. Sabemos que o emagrecimento pode ser um desafio, mas com as informações e estratégias corretas, você está no caminho certo para uma transformação positiva.

Nosso ebook reúne um conjunto abrangente de dicas, truques e orientações, cuidadosamente elaborados por especialistas em saúde e bem-estar. Abordamos uma variedade de tópicos, desde a nutrição adequada até a importância da atividade física regular, tudo com o objetivo de ajudá-lo(a) a adotar um estilo de vida saudável que promova a perda de peso de forma segura.

Para acessar o ebook e começar sua jornada rumo a uma vida mais saudável, clique no link de checkout abaixo:

https://sun.eduzz.com/1938207

Lembre-se de que o sucesso não acontece da noite para o dia, mas com determinação, paciência e aplicação consistente das estratégias que compartilhamos, você estará no caminho certo para alcançar seus objetivos. Estamos aqui para apoiá-lo(a) em cada etapa do caminho.

Aproveite o ebook e lembre-se de aplicar as dicas de forma adaptada ao seu próprio corpo e necessidades. Estamos confiantes de que, com dedicação e esforço, você alcançará os resultados que deseja.

Desejamos a você uma jornada de emagrecimento saudável, repleta de motivação, bem-estar e sucesso. Estamos ansiosos para vê-lo(a) atingir seus objetivos e melhorar sua qualidade de vida.

Clique no link de checkout abaixo para começar agora mesmo:

https://sun.eduzz.com/1938207

Bem-vindo(a) ao seu novo estilo de vida saudável!`

const conteudo_livro = "O propósito do guia sobre emagrecimento saudável é fornecer aos leitores um recurso completo e prático para ajudá-los a alcançar seus objetivos de perda de peso de forma saudável. Ao longo do livro, os leitores podem esperar encontrar, Informações sobre alimentação saudável: O guia fornecerá explicações claras e diretas sobre os fundamentos da nutrição, incluindo a seleção de alimentos saudáveis, proporções adequadas de nutrientes e dicas para criar uma alimentação equilibrada. Estratégias eficazes: Serão apresentadas estratégias comprovadas para alcançar a perda de peso de maneira saudável, incluindo a criação de um déficit calórico adequado, a importância da prática regular de atividade física e dicas práticas para estabelecer metas realistas. Dicas práticas,  guia oferecerá conselhos práticos e aplicáveis à vida cotidiana, abordando temas como planejamento de refeições saudáveis, controle de porções, estratégias para lidar com a fome emocional e a importância de um sono adequado para o processo de emagrecimento. Abordagem holística da saúde: Além do emagrecimento, o guia enfatizará a importância de uma abordagem holística para a saúde, considerando aspectos como o bem-estar mental, a prática de exercícios físicos adequados e a promoção de um estilo de vida equilibrado. Manutenção do peso alcançado: O livro também fornecerá orientações sobre como manter o peso corporal saudável a longo prazo, abordando estratégias para evitar o efeito ioiô, a importância da mudança de hábitos e dicas para lidar com possíveis desafios ao longo do caminho. No geral, o guia tem como objetivo ser um recurso claro, direto e prático para ajudar os leitores a alcançar um emagrecimento saudável e duradouro. Ele fornecerá informações confiáveis, dicas acionáveis e orientações embasadas em evidências científicas para auxiliar os leitores em sua jornada de perda de peso saudável."

const gerarMensagem = async function (mensagem){
  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: "quero que voce responda perguntas sobre meu produto, meu produto é um ebook, no valor de 27.90 reais, quero que responda apenas perguntas sobre o produto, o nome do produto é: Emagreça saudavel, atenda todos os clientes educadamente, caso a mensagem for de saudação voce apenas responde True, e mais nenhum caracteres, caso não for pergunta sobre o produto voce responde apenas: 'Null', e nenhum mais caracteres. nao responda isso aqui e nao responda caso pergunte quem é o autor, o link para comprar o livro é: https://chk.eduzz.com/1938207, é aceito cartão de credito, pix, boleto e paypal, " + conteudo_livro + ", apenas responda essa mensagem que é do meu cliente: " + mensagem,
    max_tokens: 1000
  });

  await new Promise(resolve => setTimeout(resolve, 2000));

  const texto = completion.data.choices[0].text;
  const text = texto.replace(/^\n+|\n+$/g, "");
  return text;
}

venom.create().then((client) => {
  client.onMessage((message) => {
    if (message.isGroupMsg) return;

    const senderNumber = message.from.replace('@c.us', '');

    fs.readFile('lista_participantes.txt', 'utf8', (err, data) => {
      if (err) {
        console.error('Erro ao ler o arquivo:', err);
        return;
      }

      const participantNumbers = data.split('\n').map((number) => number.replace('@c.us', ''));
      if (participantNumbers.includes(senderNumber)) {
        console.log('Mensagem ignorada. Número de telefone na lista de participantes:', senderNumber);
        return;
      }

      console.log('Nova mensagem de:', senderNumber);
      console.log('Conteúdo da mensagem:', message.body);

      // Processar a mensagem aqui
      gerarMensagem(message.body)
        .then((result) => {
          console.log(result);
          if (result.startsWith('Null')) return;
          if(result.startsWith("True")) return client.sendText(message.from, saudacoes);
          client.sendText(message.from, result);
        })
        .catch((error) => {
          console.error(error);
        });
    });
  });
}).catch((error) => {
  console.error('Erro ao iniciar o cliente do WhatsApp:', error);
});
