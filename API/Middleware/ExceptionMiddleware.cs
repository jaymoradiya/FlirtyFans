using System.Net;
using System.Text.Json;
using API.DTOs;

namespace API.Middleware
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionMiddleware> _logger;
        private readonly IHostEnvironment _env;

        public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger, IHostEnvironment env)
        {
            this._next = next;
            this._logger = logger;
            this._env = env;
        }


        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ex.Message);
                context.Response.ContentType = "application/json";
                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

                var response = _env.IsDevelopment()
                ? new ApiResponseDto<String>
                {
                    Data = ex.StackTrace,
                    Status = false,
                    Message = "Internal Server Error",
                }
                : new ApiResponseDto<String>
                {
                    Data = null,
                    Status = false,
                    Message = "Internal Server Error",
                };

                // var options = new JsonSerializerOptions
                // {
                //     PropertyNamingPolicy = JsonNamingPolicy.CamelCase
                // };
                // var json = JsonSerializer.Serialize(response, options);


                await context.Response.WriteAsJsonAsync(response);

            }
        }
    }
}