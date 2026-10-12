// Número do WhatsApp da loja (o mesmo do disk entrega na fachada)
const WHATS = '5519994464910';

const whatsLink = (texto) => `https://wa.me/${WHATS}?text=${encodeURIComponent(texto)}`;

document.querySelectorAll('[data-whats]').forEach((a) => {
  a.href = whatsLink(a.dataset.whats);
});

// ─── Agendamento ────────────────────────────────────────────
// Horários de exemplo; na versão final entram os horários reais da loja
const HORARIOS = ['08:00', '09:00', '10:00', '11:00', '13:30', '14:30', '15:30', '16:30'];
const DIAS_A_MOSTRAR = 12;

const semana = new Intl.DateTimeFormat('pt-BR', { weekday: 'short' });
const dataLonga = new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: '2-digit', month: '2-digit' });

const days = document.getElementById('days');
const times = document.getElementById('times');

// Próximos dias de atendimento, pulando domingo
const hoje = new Date();
for (let i = 1, mostrados = 0; mostrados < DIAS_A_MOSTRAR; i++) {
  const dia = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + i);
  if (dia.getDay() === 0) continue;

  const label = document.createElement('label');
  const input = document.createElement('input');
  input.type = 'radio';
  input.name = 'dia';
  input.value = dataLonga.format(dia);
  input.checked = mostrados === 0;

  const span = document.createElement('span');
  const nome = document.createElement('small');
  nome.textContent = semana.format(dia).replace('.', '');
  const numero = document.createElement('b');
  numero.textContent = dia.getDate();
  span.append(nome, numero);

  label.append(input, span);
  days.append(label);
  mostrados++;
}

HORARIOS.forEach((hora) => {
  const label = document.createElement('label');
  const input = document.createElement('input');
  input.type = 'radio';
  input.name = 'hora';
  input.value = hora;
  const span = document.createElement('span');
  span.textContent = hora;
  label.append(input, span);
  times.append(label);
});

const form = document.getElementById('booking');
const erro = document.getElementById('form-error');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const dados = new FormData(form);
  const pet = dados.get('pet').trim();

  if (!pet) { erro.textContent = 'Conta pra gente o nome do pet.'; form.pet.focus(); return; }
  if (!dados.get('hora')) { erro.textContent = 'Escolha um horário.'; return; }
  erro.textContent = '';

  const mensagem = [
    'Olá! Quero agendar pelo site:',
    '',
    `🐾 Pet: ${pet} (${dados.get('especie')}, porte ${dados.get('porte').toLowerCase()})`,
    `✂️ Serviço: ${dados.get('servico')}`,
    `📅 Dia: ${dados.get('dia')}`,
    `🕐 Horário: ${dados.get('hora')}`,
  ].join('\n');

  window.open(whatsLink(mensagem), '_blank', 'noopener');
});
