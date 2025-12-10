using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Ocelot.DependencyInjection;
using Ocelot.Middleware;

var builder = WebApplication.CreateBuilder(args);
//PORTA
builder.WebHost.UseUrls("http://localhost:5000");

//INIT
builder.Configuration.AddJsonFile("ocelot.json", optional: false, reloadOnChange: true);

//CORS GLOBAL ACCEPT
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy
            .AllowAnyOrigin()     //LIBERA TUDO
            .AllowAnyHeader()     
            .AllowAnyMethod();   
    });
});

//JWT
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer("Bearer", options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.ASCII.GetBytes(
                    builder.Configuration["Jwt:Key"] 
                    ?? "Apollo_ Key_Athena_Key_SSH256bits_Key"
                )
            )
        };
    });

builder.Services.AddAuthorization();

//BUILD
builder.Services.AddOcelot(builder.Configuration);

var app = builder.Build();

//PIPELINE
app.UseRouting();

app.UseCors("AllowAll");   //CORS ROOTS

app.UseAuthentication();
app.UseAuthorization();

//START OCELOT
await app.UseOcelot();

app.Run();
