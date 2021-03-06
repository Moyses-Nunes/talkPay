var Globalcontext = 0;
var userSaid = '';
var finalContext = 6;
var intentions = [];
var presentIntent;
//FUNÇÃO QUE FAZ A IA FALAR
function say(phrase){
    var utter = new SpeechSynthesisUtterance();
        utter.text = phrase;
        utter.lang = 'pt-BR';
        utter.rate = 1.4;
        window.speechSynthesis.speak(utter);
        //Falando...
        utter.onend = function() {
            listen();
            //Escutando...
        }
}
//FUNÇÃO QUE ADMINISTRA O FLUXO DA CONVERSA
function conversation() {
    for(i = 1; i <= intentions.length-1;i++){
        if(intentions[i].context == Globalcontext && (intentions[i].trainingPhrase == userSaid || intentions[i].trainingPhrase == "any"))
        {
            say(intentions[i].response);
            presentIntent = intentions[i];
            Globalcontext = intentions[i].nextContext;
            break;
        }
        else if (i == intentions.length - 1 && Globalcontext != finalContext)
        {
            say(intentions[0].response);
            listen();
        }
    }
}

//FUNÇÃO DE RECONHECIMENTO DE VOZ
function listen(){
    var recognizer = new window.SpeechRecognition();
    //Para o reconhecedor de voz, não parar de ouvir, mesmo que tenha pausas no usuario
    recognizer.start();
    recognizer.continuous = true;
    recognizer.onresult = function(event){
    userSaid = "";
        for (var i = event.resultIndex; i < event.results.length; i++) {
            if(event.results[i].isFinal){
                //final da fala do usuário
                userSaid = event.results[i][0].transcript;
                if (presentIntent.field != null && presentIntent.field != ""){
                    if (presentIntent.field.substr(0,4) == "form"){
                        say("Enviando");
                        document.getElementById(presentIntent.field).submit();
                    } else {
                    say("Você disse " + userSaid);
                    document.getElementById(presentIntent.field).value = userSaid;
                    if (Globalcontext == 4) document.getElementById(presentIntent.field).value = '30,00';
                    }
                }
                conversation();
                //document.getElementById("transcription2").textContent = userSaid;
                //document.getElementById("context").textContent = "Contexto: " + Globalcontext;
            }else{
                userSaid += event.results[i][0].transcript;
            }
        }
    }
}

/////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////,*--- I N T E N Ç Õ E S ---*,//////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////

class intent{
    context = 0;
    trainingPhrase = [];
    response = "";
    nextContext = 0;
    field = "";
}
function intentMk(context,tp,response,nextContext = 0,field=""){
    Intent = new intent();
    Intent.context = context;
    Intent.trainingPhrase = [tp];
    Intent.response = response;
    Intent.field = field;
    Intent.nextContext = nextContext; 
    intentions.push(Intent);
}
//INTENÇÕES
intentMk(-1,'','Desculpe, não entendi');
intentMk(0,'','Olá, denovo!. Prefere que eu liste os serviços ou tem um em mente?',1);
intentMk(1,'Liste os serviços','Você tem as opções de transferência, saque ou adicionar dinheiro',2);
intentMk(2,'transferência','Deseja tranferir por  uma conta do mercado pago ou utilizar outro cartão?',3);
intentMk(3,'mercado pago','Informe o e-mail da conta para a qual enviar o dinheiro',4,'txtEmail');
intentMk(4,'any','informe o valor a ser enviado',5,'txtValue');
intentMk(5,'any','diga uma mensagem para a conta creditada',6,'txtMsg');