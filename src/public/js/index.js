const socket = io();
let user;

Swal.fire({
    title: 'Tell us your name before you start chatting',
    confirmButtonText: 'Accept',
    input: 'text',
    allowOutsideClick: false,
    background: 'url(/images/title-background.jpg)',
    color: '#FFFFFF',
    inputValidator: (value) =>{
        if(!value){
            return 'You must type at least one character';
        }
        user = value;
    }
}).then((result)=>{
    socket.emit('new-user', {user: result.value});
    value = result.value;
    socket.on('new-user', (data)=>{
        Swal.fire({
            title: 'New user logged in!',
            text: `${data.user} has logged in.`,
            toast: true,
            position: 'top-right'
        });
    });
});

socket.on('history', (data)=>{
    let history = document.getElementById('history');
    data.forEach((item)=>{
        history.innerHTML += `<div class="${item.user == user ? 'myMessage' : ''}"><p><strong>${item.user}: </strong>${item.message}</p></div>`;
    });
})

const chatBox = document.getElementById('chatBox');

chatBox.addEventListener('keyup', (e)=>{
    if(e.key=='Enter' && e.target.value != ''){
        let message = e.target.value;
        socket.emit('message', {
            user,
            message
        });
        e.target.value = '';
    }
});

socket.on('message', (data)=>{
    let history = document.getElementById('history');
    history.innerHTML += `<div class="${data.user == user ? 'myMessage' : ''}"><p><strong>${data.user}: </strong>${data.message}</p></div>`
});