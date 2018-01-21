module.exports = {
    delayResponseTyping: function(session, seconds){
        session.sendTyping();
        session.delay(seconds*1000);
    }
}