function setTime(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;                     // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  document.getElementById('time').textContent = hours + ':' + minutes + ' ' + ampm;;
}

function setDate(date) {
  var month = date.getMonth()+1;
  month = month <= 9 ? '0' + month : month;       // add 0 for single digit numbers
  document.getElementById('date').textContent = month + "/" + date.getDate() + "/" + date.getFullYear() + " — ";
}

function cloudUploadHandler() {
  try {
    var cardTitle = document.getElementById("label").value;
    var result = document.getElementById("result-value").textContent;
    if(result != undefined) {
      var name = "nexpaq.airq.quality";
      var params = {value:result};
      if (cardTitle != "") {
        params.title = cardTitle;
      }
      console.log(params);
      nexpaqAPI.util.saveDataset(name,params,cloudResponse, cloudError);
    }
  }
  catch(e) {
      var x = document.getElementById("snackbar");
      x.textContent = "Failed!";
      x.className = "show";
      setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
    }
}

function cloudResponse(response) {
  if(JSON.parse(response).state == 'success') {
    console.log("saved");
    var x = document.getElementById("snackbar");
    x.textContent = "Saved";
    x.className = "show";
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
  }
}

function cloudError(error) {
  var x = document.getElementById("snackbar");
  x.textContent = "Error " + JSON.parse(error).error_code + " : " + JSON.parse(error).message;
  x.className = "show";
  setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}


function beforeExitActions() {
  Nexpaq.API.Module.SendCommand(Nexpaq.Arguments[0], 'StopSensor', []);
}

document.addEventListener('NexpaqAPIReady', function(event) {        
  Nexpaq.API.Module.addEventListener('DataReceived', function(event) {
      // we don't care about data not related to our module
    if(event.module_uuid != Nexpaq.Arguments[0]) return;

    if(event.data_source == 'SensorValue') {
      if(event.variables.status == 'heating') {
        //Heating
        document.getElementById('result-screen').classList.add('hidden');
        document.getElementById('heating-screen').classList.remove('hidden');	
      }
      if(event.variables.status != 'heating' && event.variables.status != 'updating_referrence') {
        //Measuring
        document.getElementById('result-screen').classList.remove('hidden');
        document.getElementById('heating-screen').classList.add('hidden');	
        document.getElementsByClassName("radial-progress")[0].classList.add('hidden');
        nativeDataUpdateHandler(event.variables.adc_value);
      }
    }
  });  
  Nexpaq.API.addEventListener('BeforeExit', beforeExitActions);

  Nexpaq.API.Module.SendCommand(Nexpaq.Arguments[0], 'StartSensor', []);
});  


/* =========== ON PAGE LOAD HANDLER */
document.addEventListener("DOMContentLoaded", function(event) {
  Nexpaq.Header.create('Air Quality');
  Nexpaq.Header.customize({color: "white", iconColor:"white", backgroundColor:"#0EA4E3"});
  Nexpaq.Header.hideShadow();
  
  document.getElementById('button-snapshot').addEventListener('click', function() {
    var current_date = new Date();
    setDate(current_date);
    setTime(current_date);
    document.getElementById('result-screen').classList.add('hidden');
    document.getElementById('snapshot-screen').classList.remove('hidden');
    document.getElementById('measurement_table').classList.remove('slideright');
    document.getElementById('measurement_table').classList.remove('slideleft');
    document.getElementById('measurement_table').classList.add('slidedown');
    document.getElementById('result-value').textContent = document.getElementById('result-title').textContent;
  });

    document.getElementById('button-cancel').addEventListener('click', function() {
    document.getElementById('measurement_table').classList.remove('slidedown');
    document.getElementById('measurement_table').classList.remove('slideright');
    document.getElementById('measurement_table').classList.add('slideleft');
    setTimeout(function() {
      document.getElementById('snapshot-screen').classList.add('hidden');
      document.getElementById("label").value = "";
      document.getElementById('result-screen').classList.remove('hidden');
    },1000);
  });

  document.getElementById('button-history').addEventListener('click', function() {
    cloudUploadHandler();
    document.getElementById('measurement_table').classList.remove('slideleft');
    document.getElementById('measurement_table').classList.remove('slidedown');
    document.getElementById('measurement_table').classList.add('slideright');
    setTimeout(function() {
      document.getElementById('snapshot-screen').classList.add('hidden');
      document.getElementById("label").value = "";
      document.getElementById('result-screen').classList.remove('hidden');
    },1000);
  });

	createProgress();

  Nexpaq.Header.addEventListener('BackButtonClicked', function(e) {
    if(document.getElementById('result-screen').classList.contains('hidden')) {
      document.getElementById('snapshot-screen').classList.add('hidden');
      document.getElementById('result-screen').classList.remove('hidden');
    } else {
      Nexpaq.API.Exit();
    }
  });
});

