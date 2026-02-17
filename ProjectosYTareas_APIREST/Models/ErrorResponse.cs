namespace ProjectosYTareas_APIREST.Models;

//Clase para respuesta estandar de errores en la API.
public class ErrorResponse
{
    //Código HTTP.
    public int StatusCode { get; set; }

    //Mensaje de error.
    public string Message { get; set; }

    //Detalles adicionales del error.
    public string Details { get; set; }

    //Timestamp del error.
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;

    //Path del error.
    public string Path { get; set; }
}
