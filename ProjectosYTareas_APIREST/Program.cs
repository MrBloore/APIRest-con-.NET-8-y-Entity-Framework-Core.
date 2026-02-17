using Context.Repository;
using Microsoft.EntityFrameworkCore;
using ProjectosYTareas_APIREST.Repositories;
using ProjectosYTareas_APIREST.Services;
using ProjectosYTareas_APIREST.Middleware;

var builder = WebApplication.CreateBuilder(args);

//Conexión a la DB.
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

// Configuración del DbContext con SQL Server.
builder.Services.AddDbContext<AppDbContext>(options => options.UseSqlServer(connectionString));

// Registro de inyección de dependencias para repositorios y servicios.
builder.Services.AddScoped<IProjectRepository, ProjectRepository>();
builder.Services.AddScoped<IProjectService, ProjectService>();
builder.Services.AddScoped<ITaskItemRepository, TaskItemRepository>();
builder.Services.AddScoped<ITaskItemService, TaskItemService>();

//Agregando controladores y Swagger.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Habilitando CORS para permitir solicitudes desde cualquier origen.
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", builder =>
    {
        builder.AllowAnyOrigin()
               .AllowAnyMethod()
               .AllowAnyHeader();
    });
});

//Construccion de la aplicacion.
var app = builder.Build();

//Si la app esta en desarrollo, habilita Swagger para testing.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Middleware global de manejo de excepciones (debe estar al inicio)
app.UseGlobalExceptionHandling();

// Redirigiendo HTTP a HTTPS, habilitando autorizacion y mapeando controladores.
app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseCors("AllowAll");
app.UseAuthorization();
app.MapControllers();

//Ejecucion de la aplicacion.
app.Run();
