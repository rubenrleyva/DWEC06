/**
 * DWEC06 - Programación AJAX en JavaScript
 * Tarea 6: Predicción del tiempo
 * Rubén Ángel Rodriguez Leyva
 */

/**
 * Función encargada de la predicción del tiempo a 1 días.
 */
function elTiempoHoy(){
    
    var ciudad = $("#ciudad").val(); // Averiguamos la ciudad
    var mostrar = ""; // Variable encargada de mostrar la tabla.
    
    // Si la varible ciudad no se encuentra vacía.
    if(ciudad !== '')
    {
        $.ajax({
            url: 'http://api.openweathermap.org/data/2.5/weather?q='+ciudad+'&lang=es&units=metric&APPID=91c72973fb4e925c8a734434c6c5a821',
            type: "GET",
            dataType: "json", 
            success: function(datos){        
                // En caso de que exista viento
                if(datos.wind.speed > 0)
                {
                    mostrar =  "<table>"+
                    "<tr>"+
                        "<th>Tipo de tiempo</th>"+
                        "<th>Temperatura.</th>"+
                        //"<th>Temperatura máxima diaria.</th>"+
                        "<th>Velocidad viento.</th>"+
                        "<th>Icono</th>"+
                    "</tr>"+
                    "<tr>"+
                        "<td>"+datos.weather[0].description+"</td>"+
                        "<td>"+datos.main.temp+" ºC</td>"+
                        //"<td>"+datos.main.temp_max+" ºC</td>"+
                        "<td>"+datos.wind.speed+" m/s</td>"+
                        "<td><img src='http://openweathermap.org/img/w/"+datos.weather[0].icon+".png'></td>"+    
                    "</tr>"+
                    "</table>"+
                    "<br/>";
                }
                else // en caso contrario no lo mostramos.
                {
                    mostrar =  "<table>"+
                    "<tr>"+
                        "<th>Tipo de tiempo</th>"+
                        "<th>Temperatura.</th>"+
                        //"<th>Temperatura máxima diaria.</th>"+ 
                        "<th>Icono</th>"+
                    "</tr>"+
                    "<tr>"+
                        "<td>"+datos.weather[0].description+"</td>"+
                        "<td>"+datos.main.temp+" ºC</td>"+
                        //"<td>"+datos.main.temp_max+" ºC</td>"+
                        "<td><img src='http://openweathermap.org/img/w/"+datos.weather[0].icon+".png'></td>"+    
                    "</tr>"+
                    "</table>"+
                    "<br/>";
                }          
                $("#prediccion").html(mostrar); // Mostramos los datos en su etiquta.
                $("#mapdiv").empty(); // Limpiamos la etiquta del mapa
                $("#mapdiv").html(mapa(datos.coord.lon, datos.coord.lat)); // Creamos el mapa y la pasamos las coordenadas   
            }
        });
    }
    else // en caso contrario, avisamos.
    {
        $("#prediccion").html("No has introducido una ciudad."); // Mostramos el mensaje de que no existe la ciudad.
        $("#mapdiv").css('display', 'none'); // Escondemos la etiqueta encargada del mapa.
    }
}

/**
 * Función encargada de la predicción del tiempo a 4 días.
 */
function elTiempoCuatro()
{
    
    //$("#prediccion").empty();
    
    var ciudad = $("#ciudad").val(); // Averiguamos la ciudad
    var mostrar = ""; // La tabla a mostrar
    var tempMinima, tempMaxima; // Variables para las temperaturas.
    
    // Si se ha introducido una ciudad
    if(ciudad !== '')
    {
        $.ajax({
            url: 'http://api.openweathermap.org/data/2.5/forecast?q='+ciudad+'&lang=es&ctn=5&units=metric&APPID=91c72973fb4e925c8a734434c6c5a821',
            type: "GET",
            dataType: "json", 
            success: function(datos){
                
                // Generamos la fecha
                var fecha = new Date();
                
                // Extraemos la hora de la fecha
                var horas = fecha.getHours();
                
                // Como la previsión es de 3 en 3 horas en caso de que la hora no sea
                // multiplo de 3 le sumamos una hora hasta que lo sea.
                while(horas % 3 !== 0){
                   horas += 1; 
                }

                // Recorremos la lista de datos que nos pasa openweather
                for(var i = 1; i < datos.list.length; i++)
                {
                    // Recogemos los datos de las 3 de la mañana para la temperatura mínima
                    // en caso de no existir dicha información recogemos la temp del momento.
                    if(datos.list[i].dt_txt.indexOf("03:00:00") > -1){
                        tempMinima = datos.list[i].main.temp_min;
                    }
                    
                    // Recogemos los datos de las 15 de la tarde para la temperatura máxima
                    // en caso de no existir dicha información recogemos la temp del momento.
                    if(datos.list[i].dt_txt.indexOf("15:00:00") > -1){
                        tempMaxima = datos.list[i].main.temp_max;
                    }                
                    
                    // Mostramos los datos de la hora a la que estamos
                    if(datos.list[i].dt_txt.indexOf(horas+":00:00") > -1)
                    {
                        /*
                        // Si no existen las horas de las 3 de la mañna y las 15 de la tarde
                        // nos dará un dato erroneo por lo tanto se recogeran los datos del momento.
                        if(isNaN(tempMinima)){
                            tempMinima = datos.list[i].main.temp_min;
                        }
                        
                        if(isNaN(tempMaxima)){
                            tempMaxima = datos.list[i].main.temp_max;
                        }*/
                        
                        // Si la velocidad del viento es mayor de cero mostramos la tabla con dicho valor.
                        if(datos.list[i].wind.speed > 0)
                        {
                            
                            mostrar +=  "<table>"+
                            "<tr>"+
                                "<th>Fecha y Hora</th>"+
                                "<th>Nubosidad</th>"+
                                "<th>Temperatura Máxima</th>"+
                                "<th>Temperatura Mínima</th>"+
                                "<th>Velocidad del viento</th>"+
                                "<th>Icono</th>"+
                            "</tr>"+
                            "<tr>"+
                                "<td>"+datos.list[i].dt_txt+"</td>"+
                                "<td>"+datos.list[i].clouds.all+" %</td>"+
                                "<td>"+tempMaxima+" ºC</td>"+
                                "<td>"+tempMinima+" ºC</td>"+
                                "<td>"+datos.list[i].wind.speed+" m/s</td>"+
                                "<td><img src='http://openweathermap.org/img/w/"+datos.list[i].weather[0].icon+".png'></td>"+    
                            "</tr>"+
                            "</table>"+
                            "</br>";
                        
                        }
                        else // en caso contrario mostramos la tabla sin el viento.
                        {
                            
                            mostrar +=  "<table>"+
                            "<tr>"+
                                "<th>Fecha y Hora</th>"+
                                "<th>Nubosidad</th>"+
                                "<th>Temperatura Máxima</th>"+
                                "<th>Temperatura Mínima</th>"+
                                "<th>Icono</th>"+
                            "</tr>"+
                            "<tr>"+
                                "<td>"+datos.list[i].dt_txt+"</td>"+
                                "<td>"+datos.list[i].clouds.all+" %</td>"+
                                "<td>"+tempMaxima+" ºC</td>"+
                                "<td>"+tempMinima+" ºC</td>"+
                                "<td><img src='http://openweathermap.org/img/w/"+datos.list[i].weather[0].icon+".png'></td>"+    
                            "</tr>"+
                            "</table>"+
                            "<br/>";
                        }
                    }
                    
                    $("#prediccion").html(mostrar);  //Mostramos la predicción en su etiqueta
                }
                $("#mapdiv").empty(); // Vaciamos la etiqueta encargada del mapa
                mapa(datos.city.coord.lon, datos.city.coord.lat); // Creamos el mapa y la pasamos las coordenadas
            }
        });
    }
    else
    {
        $("#prediccion").html("No has introducido una ciudad."); // Mostramos el mensaje de que no existe la ciudad.
        $("#mapdiv").css('display', 'none'); // Escondemos la etiqueta encargada del mapa.
    }
}

/**
 * Función encargada de mostrar el mapa.
 * 
 * @param {type} lon La longitud.
 * @param {type} lat La latitud.
 */
function mapa(lon, lat)
{
    // Mostramos el mapa
    $("#mapdiv").css('display', 'block'); // Escondemos la etiqueta encargada del mapa.
    
    var map = new OpenLayers.Map('mapdiv', 'margin: 0 auto');
    map.addLayer(new OpenLayers.Layer.OSM());
    var layer_switcher= new OpenLayers.Control.LayerSwitcher({});
    map.addControl(layer_switcher);
    //Set start centrepoint and zoom    
    var lonLat = new OpenLayers.LonLat( lon, lat).transform(
        new OpenLayers.Projection("EPSG:4326"), // transform from WGS 1984
        map.getProjectionObject() // to Spherical Mercator Projection
    );
    var zoom=13;
    map.setCenter(lonLat, zoom);
}
