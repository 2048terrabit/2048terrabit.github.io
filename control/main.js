/*global $, jQuery, alert*/

$(function () {
    
    // Для каждого тэга с классом "gauge"...
    $('.gauge').each(function () {
        
        // Получаем значения параметров
        var min = $(this).data("min");
        var max = $(this).data("max");
        var value = $(this).data("value");
         
        
        // Присоеденяем к тэгу остольные элементы шкалы
        $(this).html($('<div>', {class: 'min'}));
        $(this).append($('<div>', {class: 'max'}));
        $(this).append($('<div>', {class: 'arrow-container'})
                            .append($('<div>', {class: 'arrow'})
                                .append($('<div>', {class: 'value'}))
                            )
                      );


        // Устанавливаем текст минимального значения
        $(this).find(".min").text(min);
        
        // Устанавливаем текст максимального значения
        $(this).find(".max").text(max);
        
        // Устанавливаем текст текущего значения
        $(this).find(".arrow-container .arrow .value").text(value);
        
        // Определяем угол наклона стрелки и присваиваем его
        var angle = 180.0 / (max - min) * (value - min) - 90;
        
        $(this).find(".arrow-container .arrow").css("transform", "rotateZ(" + angle + "deg)");

    });
    
    
    
    // Код для работы кнопки
    $("#myButton").click(function () {
        
        setGaugeValue( $("#myInput").val() );
    });
    
});



/**
 * Функция для изменения значения шкалы.
 * @param {number} value - Новое значение шкалы.
 */
function setGaugeValue(value) {
    
    var $this = $("#myTest");
    
    // Проверяем является ли value числом
    if (isNaN(parseFloat(value))) {
        return;
    }
    
    value = parseFloat(value);

    
    // Получаем минмальное и максимальное значение шкалы
    var min = $this.data("min");
    var max = $this.data("max");
    
    
    // Проверяем вмещается ли новое значение шкалы в диапозон
    if (value < min)   value = min;
    if (value > max)   value = max;
    
    
    // Сохраняем новое значение шкалы
    $this.data("value", value);
    $this.find(".arrow-container .arrow .value").text(value);
    
    
    // Считаем новый угол и поворачиваем стрелку
    var angle = 180.0 / (max - min) * (value - min) - 90;
    
    $this.find(".arrow-container .arrow").css("transform", "rotateZ(" + angle + "deg)");
}
