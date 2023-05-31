const venom = require('venom-bot');
const fs = require('fs');

venom.create().then((client) => {
  obterContatos(client);
}).catch((error) => {
  console.error('Erro ao iniciar o cliente do WhatsApp:', error);
});

async function obterContatos(client) {
  const contacts = await client.getAllContacts();
  const contactNumbers = contacts.map((contact) => contact.number);

  fs.readFile('lista_participantes.txt', 'utf8', (err, data) => {
    if (err) {
      console.error('Erro ao ler o arquivo:', err);
    } else {
      const existingNumbers = data.split('\n');
      const allNumbers = [...new Set([...existingNumbers, ...contactNumbers])];
      const listContent = allNumbers.join('\n');

      fs.writeFile('lista_participantes.txt', listContent, (err) => {
        if (err) {
          console.error('Erro ao atualizar o arquivo:', err);
        } else {
          console.log('Lista de participantes atualizada com sucesso!');
        }
      });
    }
  });
}
