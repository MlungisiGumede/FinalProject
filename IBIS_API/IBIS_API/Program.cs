using IBIS_API.Data;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;
using IBIS_API.Factory;
using IBIS_API.Models;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Newtonsoft.Json;
using Microsoft.ML;
using Microsoft.ML.Data;
using Microsoft.ML.OnnxRuntime;
using Microsoft.ML.Transforms.Onnx;
//using Microsoft.AspNet.Identity.Owin;
//using Microsoft.Owin;


var builder = WebApplication.CreateBuilder(args);
//builder.Services.AddCors(options => options.AddPolicy(name: "new",
//    policy =>
//    {

//        policy.WithOrigins("http://localhost:4200").AllowAnyHeader().AllowAnyMethod().AllowCredentials();
//    }));
builder.Services.AddCors(options => options.AddDefaultPolicy(
    include =>
    {
        include.AllowAnyHeader();
        include.AllowAnyMethod();
        include.AllowAnyOrigin();
    }));
builder.Services.AddControllers();


// Add services to the container.

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle

builder.Services.AddIdentity<AppUser, IdentityRole>(options =>
{
    options.Password.RequireUppercase = false;
    options.Password.RequireLowercase = false;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireDigit = true;
    options.User.RequireUniqueEmail = true;
    options.SignIn.RequireConfirmedEmail = true;
    //options.User.re
})
.AddEntityFrameworkStores<DataContextcs>()
.AddDefaultTokenProviders().AddRoles<IdentityRole>();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddControllersWithViews()
    .AddJsonOptions(options => options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles);
builder.Services.AddDbContext<DataContextcs>(options =>
{
     options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
    //options.UseSqlServer(builder.Configuration.GetConnectionString("MyDbConnection"));
});

builder.Services.AddAuthentication()
                .AddCookie()
                .AddJwtBearer(options =>
                {
                    options.SaveToken = true;
                    options.TokenValidationParameters = new TokenValidationParameters()
                    {
                        ValidateIssuer = true,
                        ValidateAudience = true, // https://www.c-sharpcorner.com/article/jwt-json-web-token-authentication-in-asp-net-core/
                        ValidIssuer = builder.Configuration["Tokens:Issuer"],
                        ValidAudience = builder.Configuration["Tokens:Audience"],
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Tokens:Key"])),
                        ClockSkew = TimeSpan.Zero
                    };
                });

//builder.Services.AddSingleton<PredictionEngine<ModelInput, ModelOutput>>(service =>
//{
//    MLContext mlContext = new MLContext();
//    ModelInput mI = new ModelInput();
//    var model = mI.ModelStartup();
//    var engine = mlContext.Model.CreatePredictionEngine<ModelInput, ModelOutput>(model);
//    return engine;


//});


builder.Services.AddCors(options => options.AddDefaultPolicy(
    include =>
    {
        include.AllowAnyHeader();
        include.AllowAnyMethod();
        include.AllowAnyOrigin();
    }));
// with origins before 

builder.Services.Configure<FormOptions>(o =>
{
    o.ValueLengthLimit = int.MaxValue;
    o.MultipartBodyLengthLimit = int.MaxValue;
    o.MemoryBufferThreshold = int.MaxValue;
});
builder.Services.AddApplicationInsightsTelemetry(builder.Configuration["APPLICATIONINSIGHTS_CONNECTION_STRING"]);

//builder.Services.Configure<DataProtectionTokenProviderOptions>(options => options.TokenLifespan = TimeSpan.FromSeconds(30));
var app = builder.Build();

app.UseCors();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}


//builder.Services.AddControllers();
app.UseHttpsRedirection();
//app.CreatePerOwinContext(AppUser.Create);
app.UseAuthorization();
//app.UseAuthorization();
app.UseAuthentication();

app.MapControllers();

app.Run();
