using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using WatchmanAttendance.API.Repositories;
using WatchmanAttendance.API.Services;

var builder = WebApplication.CreateBuilder(args);

// Controllers
builder.Services
                .AddControllers()
                .AddJsonOptions(opt =>
                 {
                     opt.JsonSerializerOptions.PropertyNamingPolicy =
                         System.Text.Json.JsonNamingPolicy.CamelCase;
                 });

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Watchman Attendance API",
        Version = "v1"
    });

    //  JWT Bearer Definition
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter: Bearer {your JWT token}"
    });

    //  Apply JWT globally
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// Custom services
builder.Services.AddSingleton<DbConnectionFactory>();
builder.Services.AddSingleton<TimeZoneService>();
builder.Services.AddScoped<JwtService>();
builder.Services.AddScoped<WatchmanRepository>();
builder.Services.AddScoped<AttendanceRepository>();
builder.Services.AddScoped<AdminRepository>();
builder.Services.AddScoped<AdminAuthRepository>();
builder.Services.AddScoped<QrLocationRepository>();
builder.Services.AddScoped<WatchmanDashboardRepository>();
builder.Services.AddScoped<ShiftRepository>();
builder.Services.AddScoped<AttendanceRequestRepository>();
builder.Services.AddScoped<AdminAuditRepository>();






// JWT Auth
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!)
        )
    };
});



builder.Services.AddAuthorization();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular",
        policy =>
        {
            policy
                .WithOrigins(
                    "http://localhost:4200",
                    "https://localhost:4200",
                    "http://localhost:5240",
                    "https://localhost:7098"
                )
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials();
        });
});

var app = builder.Build();

// Middleware
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

//app.UseHttpsRedirection();

/*  REQUIRED */
app.UseRouting();

/*  CORS MUST be after routing */
app.UseCors("AllowAngular");

/* auth AFTER cors */
app.UseAuthentication();
app.UseAuthorization();

app.UseStaticFiles();

app.MapControllers();

app.Run();
