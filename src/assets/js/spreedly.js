var environment = {};
var btoken = '';
var rUrl = '';

env = function () {
  return {
    init: function (env, accessToken, url) {
      environment = env;
      btoken = accessToken;
      rUrl = url;
    }
  };
}();

Spreedly.on('3ds:status', statusUpdates);

function statusUpdates(event){
  console.log(event);

  var token = event.token;


  document.getElementById("challenge-modal").classList.add("hidden");

  if (event.action === 'succeeded') {
    console.log('red', [rUrl, token]);
    window.location.href = rUrl;

  } else if (event.action === 'error') {
    window.location.href = '/book/failure';
  } else if (event.action === 'challenge') {
    document.getElementById("challenge-loader").classList.add("hidden");
    document.getElementById('challenge-modal').classList.remove('hidden');
  } else if (event.action === 'trigger-completion') {
    $.ajax({
      url: environment.apiUrl+'v1/payment/complete',
      type: 'POST',
      data: {
        token: token
      },
      headers: {
        Authorization: 'Bearer '+btoken
      },
      success: function (res) {
        var transaction = res.meta_data.transaction;

        if (transaction.state === "succeeded") {
          console.log('success');
          window.location.href = rUrl;
        }else if (transaction.state === "pending") {
          console.log('pending');
          document.getElementById("challenge-loader").classList.add("hidden");
          event.finalize(transaction);
        }else if (transaction.state === "gateway_processing_failed") {
          window.location.href = '/book/failure';
        } else {
          window.location.href = '/book/failure';
        }
      }
    });
  }
}
