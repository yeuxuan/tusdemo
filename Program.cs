using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using System.Text;
using System.Threading;
using tusdotnet;
using tusdotnet.Interfaces;
using tusdotnet.Models;
using tusdotnet.Models.Configuration;
using tusdotnet.Models.Expiration;
using tusdotnet.Stores;
using static System.Formats.Asn1.AsnWriter;

namespace TusDemo
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.WebHost.ConfigureKestrel((context, options) =>
            {
                options.Limits.MaxRequestBodySize = long.MaxValue;
            });

            // 添加控制器视图
            builder.Services.AddControllersWithViews();

            var app = builder.Build();

            // 配置管道
            if (!app.Environment.IsDevelopment())
            {
                app.UseExceptionHandler("/Home/Error");
             
                app.UseHsts();
            }
            // 配置tus 服务
            app.UseTus(context=> CreateTusConfiguration(builder));

            app.UseHttpsRedirection();

            app.UseStaticFiles();

            app.UseRouting();

            app.UseAuthorization();

            app.MapControllerRoute(
                name: "default",
                pattern: "{controller=Home}/{action=Index}/{id?}"
                );

            app.Run();
        }

        private static DefaultTusConfiguration CreateTusConfiguration(WebApplicationBuilder builder)
        {
            var env = builder.Environment.WebRootPath;

            //文件上传路径
            var tusFiles = Path.Combine(env, "tusfiles");

            if (!Directory.Exists(tusFiles))
            {
                Directory.CreateDirectory(tusFiles);
            }

            return new DefaultTusConfiguration() {
                UrlPath= "/uploadfile",
                //文件存储路径
                Store = new TusDiskStore(tusFiles),
                //元数据是否允许空值
                MetadataParsingStrategy = MetadataParsingStrategy.AllowEmptyValues,
                //文件过期后不再更新
                Expiration = new AbsoluteExpiration(TimeSpan.FromMinutes(5)),
                //事件处理（各种事件，满足你所需）
                Events = new Events
                {
                    //上传完成事件回调
                    OnFileCompleteAsync = async ctx =>
                    {
                        //获取上传文件
                        var file = await ctx.GetFileAsync();

                        //获取上传文件元数据
                        var metadatas = await file.GetMetadataAsync(ctx.CancellationToken);

                        //获取上述文件元数据中的目标文件名称
                        var fileNameMetadata = metadatas["name"];

                        //目标文件名以base64编码，所以这里需要解码
                        var fileName = fileNameMetadata.GetString(Encoding.UTF8);

                        var extensionName = Path.GetExtension(fileName);

                        //将上传文件转换为实际目标文件
                        File.Move(Path.Combine(tusFiles, ctx.FileId), Path.Combine(tusFiles, $"{ctx.FileId}{extensionName}"));

                        var terminationStore = ctx.Store as ITusTerminationStore;
                        await terminationStore!.DeleteFileAsync(file.Id, ctx.CancellationToken);

                    }
                }
            };
        }






 

    }
}