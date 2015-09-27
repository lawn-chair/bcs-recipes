/*! bcs-recipe-editor - v0.1.0 - 2015-09-26 */!function(){function a(a){for(var b=[],c=0;4>c;c++)b.push(e.read("process/"+a+"/timer/"+c));return Q.all(b)}function b(a){var b=[];return async.times(8,function(c){b.push(e.read("process/"+a+"/state/"+c).then(function(b){return Q.all([e.read("process/"+a+"/state/"+c+"/exit_conditions").then(function(a){return a}),e.read("process/"+a+"/state/"+c+"/output_controllers").then(function(a){return a})]).then(function(a){return b.exit_conditions=a[0],b.output_controllers=a[1],b})}))}),Q.all(b)}var c,d,e=null,f={};!function(a){a.version=1,a.fields=[],a.stored={},a.url=null,a.load=function(b){if(a.url=b,!localStorage["bcs-recipe.fields"])return console.log("no data in localStorage"),!1;var c=JSON.parse(localStorage["bcs-recipe.fields"]);return console.log("Loading: "+b+": "+c.toString()),c.version===a.version&&c[b]?(a.stored=c,void(a.fields=c[b])):(console.error("Version mismatch."),!1)},a.save=function(){a.stored[a.url]=a.fields,a.stored.version=a.version,console.log("Saving: "+a.url+": "+a.stored.toString()),localStorage["bcs-recipe.fields"]=JSON.stringify(a.stored)},a.eachName=function(b){a.fields.map(function(a){return a.name}).filter(function(a,b,c){return c.indexOf(a)===b}).forEach(function(c,d,e){b(a.fields.filter(function(a){return a.name===c}),d,e)})},a.each=function(b){a.fields.forEach(b)},a.clear=function(){a.fields=[]},a.push=function(b){a.fields.push(b)}}(c={}),function(a){function b(){var a=$("#setup .fields fieldset").last().clone(!0),b=a.find("div.form-group");return b.attr("data-id",parseInt(b.attr("data-id"))+1),a.find("[data-name]").val(""),a.find("[data-name=targetState]").empty(),a.find("[data-name=targetElement]").empty(),$("#setup .fields fieldset").last().after(a),a}function d(a,b){a.empty(),a.append(new Option("")),$.each(e.processes[b].states,function(b,c){a.append(new Option(c.name,b))})}function g(a,b,c){var d=e.processes[b.val()];a.empty(),a.append(new Option("")),$.each(d.states[c].timers,function(b,c){c.used&&!c.preserve&&a.append(new Option("Timer: "+d.timers[b].name,"timer-"+b))}),$.each(d.states[c].output_controllers,function(b,c){(3===c.mode||4===c.mode)&&a.append(new Option("Output: "+e.outputs[b].name,"oc-"+b))}),$.each(d.states[c].exit_conditions,function(b,c){var f;c.enabled&&(2===c.source_type?(f=d.timers[c.source_number].name,a.append(new Option("Exit Condition "+(b+1)+": "+f,"ec-"+b))):1===c.source_type?(f=e.probes[c.source_number].name,a.append(new Option("Exit Condition "+(b+1)+": "+f,"ec-"+b))):a.append(new Option("Exit Condition "+(b+1),"ec-"+b)))})}var h=0;a.nextField=function(){var a=$("#setup .fields fieldset");return 0===h++?a.first():b()},a.initialize=function(){var a=$("#setup [data-name=targetProcess]");a.empty(),a.append(new Option("")),$.each(e.processes,function(b,c){a.append(new Option(c.name,b))}),$("#setup [data-name=targetProcess]").on("change",function(a){var b=$(a.target).siblings("[data-name=targetState]"),c=a.target.value;d(b,c),$(a.target).siblings("[data-name=targetElement]").empty()}),$("#setup [data-name=targetState]").on("change",function(a){var b=$(a.target).siblings("[data-name=targetElement]"),c=$(a.target).siblings("[data-name=targetProcess]");g(b,c,a.target.value)}),c.each(function(a){var b=f.setup.nextField();b.find("[data-name=variable]").val(a.name),b.find("[data-name=targetProcess]").val(a.process),d(b.find("[data-name=targetState]"),a.process),b.find("[data-name=targetState]").val(a.state),g(b.find("[data-name=targetElement]"),b.find("[data-name=targetProcess]"),a.state),b.find("[data-name=targetElement]").val(a.element)}),$("#setup button").on("click",function(a){a.preventDefault(),c.clear(),$("#setup .fields div.form-group").each(function(a,b){var d=$(b),e={name:d.find("[data-name=variable]").val(),process:d.find("[data-name=targetProcess]").val(),state:d.find("[data-name=targetState]").val(),element:d.find("[data-name=targetElement]").val()};c.push(e)}),c.save(),f.entry.initialize()}),$("#setup a.new").on("click",b),$("#setup a.remove").on("click",function(a){a.preventDefault();var b=$(a.target).parents("fieldset");"0"!==b.find("div.form-group").attr("data-id")?b.remove():b.find("[data-name]").val("")})}}(f.setup={}),function(a){function b(a){var b=null;switch(a.element.split("-")[0]){case"oc":b="/output_controllers";break;case"ec":b="/exit_conditions";break;case"timer":b=""}return"process/"+a.process+"/state/"+a.state+b}a.initialize=function(){$("#values fieldset:not(.template):not(.bcs)").remove(),c.eachName(function(a){a.forEach(function(a,c){var d=$("#values fieldset.template").clone(),f=d.find("input"),g=a.element.split("-")[0],h=a.element.split("-")[1];if(0===c&&d.removeClass("hide"),d.removeClass("template"),d.find("label").html(a.name),f.attr("data-api",b(a)),f.attr("data-key",h),f.attr("data-fieldmatch",a.name),"oc"===g)f.attr("data-type","number");else if("timer"===g)f.attr("data-type","time");else if("ec"===g)switch(e.processes[a.process].states[a.state].exit_conditions[h].source_type){case 2:f.attr("data-type","time");break;case 1:f.attr("data-type","number")}"timer"===g?(f.attr("data-attr","init"),f.attr("data-object","timers")):f.attr("data-attr","oc"===a.element.split("-")[0]?"setpoint":"value"),e.read(b(a)).then(function(a){f.attr("data-object")&&(a=a[f.attr("data-object")]);var b=a[f.attr("data-key")][f.attr("data-attr")]/10;("timer"===g||"number"!==f.attr("data-type"))&&(b=new BCS.Time(10*b).toString()),f.val(b)}),f.on("change",function(){var b={key:parseInt(f.attr("data-key")),value:{}};"number"===f.attr("data-type")?b.value[f.attr("data-attr")]=10*parseInt(f.val()):"time"===f.attr("data-type")&&(b.value[f.attr("data-attr")]=10*new BCS.Time.fromString(f.val()).value),"timer"===g&&(b={timers:b}),e.write(f.attr("data-api"),b).then(function(a){var b="number"===f.attr("data-type")?a[f.attr("data-key")][f.attr("data-attr")]/10:new BCS.Time(a[f.attr("data-key")].value/10).toString();f.val(b)}),f.parents("fieldset").hasClass("hide")||$('fieldset.hide [data-fieldmatch="'+a.name+'"]').val(f.val()).trigger("change")}),$("#values .fields").append(d)})})}}(f.entry={}),$(document).ready(function(){$("[data-name=bcs]").on("change",function(d){e=new BCS.Device(d.target.value),e.on("notReady",function(){$(d.target).parent().addClass("has-error").removeClass("has-success")}).on("ready",function(){c.load(e.address),Object.keys(c.stored).forEach(function(a){if("version"!==a){var b=$("#exportSystems");b.append($('<label class="checkbox">'+a+"</label>").append($('<input type="checkbox" data-name="'+a+'" checked>')))}}),localStorage["bcs-backup.url"]=e.address,$(d.target).parent().addClass("has-success").removeClass("has-error"),$(".loading").removeClass("hide"),$(".fields").addClass("hide"),async.series([function(c){e.processes||(e.processes=[]),async.times(8,function(c,d){e.read("process/"+c).then(function(a){return e.processes[c]={name:a.name,states:[]},b(c)}).then(function(b){return e.processes[c].states=b,a(c)}).then(function(a){e.processes[c].timers=a})["catch"](function(){$(".failed").removeClass("hide"),$(".loading").addClass("hide"),$(".fields").addClass("hide")})["finally"](d)},c)},function(a){e.helpers.getOutputs().then(function(a){e.outputs=a})["finally"](a)},function(a){e.helpers.getProbes().then(function(a){e.probes=a})["finally"](a)}],function(){f.setup.initialize(),f.entry.initialize(),$(".loading").addClass("hide"),$(".fields").removeClass("hide")})})}),localStorage["bcs-backup.url"]&&($("[data-name=bcs]").val(localStorage["bcs-backup.url"]),$("[data-name=bcs]").change());var g=$("#settingsMenu");g.prepend($("<li></li>").append($('<a href="#" data-toggle="modal" data-target="#export">Export Settings</a>'))),g.prepend($("<li></li>").append($('<a href="#" data-toggle="modal" data-target="#import">Import Settings</a>'))),$("#export button[data-name=export]").on("click",function(a){a.preventDefault();var b={version:c.version};$("#exportSystems input:checked").each(function(a,d){b[d.dataset.name]=c.stored[d.dataset.name]});var d=new Blob([JSON.stringify(b)],{type:"text/plain;charset=utf-8"});saveAs(d,($("[data-name=fileName]").val()||"bcs-recipe-settings")+".json"),$("#export").modal("hide")}),$("#import [data-name=fileName]").on("change",function(a){var b,e=a.target.files[0];b=new FileReader,b.addEventListener("load",function(a){var b=$("#importSystems");b.empty(),d=JSON.parse(a.target.result),d.version===c.version&&Object.keys(d).forEach(function(a){"version"!==a&&b.append($('<label class="checkbox">'+a+"</label>").append($('<input type="checkbox" data-name="'+a+'" checked>')))}),$("#import button").removeClass("hide")}),$("#import button[data-name=import]").on("click",function(){c.stored.version=d.version,$('#import input[type="checkbox"]').each(function(a,b){b.checked&&d[b.dataset.name]&&(c.stored[b.dataset.name]=d[b.dataset.name])}),localStorage["bcs-recipe.fields"]=JSON.stringify(c.stored)}),b.readAsText(e)})})}();