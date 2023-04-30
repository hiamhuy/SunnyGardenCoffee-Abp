using MediatR;
using SunnyGardenCoffee.Helper;
using System;
using System.IO;
using System.Security.Cryptography;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace SunnyGardenCoffee.Common.Business
{
    public class GetQueryFromTokenRequest : IRequest<string>
    {
        private string Token { get; set; }
        public GetQueryFromTokenRequest(string token)
        {
            Token = token;
        }

        //CustomHandler
        private class CustomHandler : IRequestHandler<GetQueryFromTokenRequest, string>
        {
            private readonly IOrdAppFactory _factory;

            public CustomHandler(IOrdAppFactory factory)
            {
                _factory = factory;
            }

            public async Task<string> Handle(GetQueryFromTokenRequest request, CancellationToken cancellationToken)
            {
                var token = request.Token;

                if (string.IsNullOrEmpty(token)) return token;
                var cacheData = await _factory.CacheManager.GetCache("RawSql").GetOrDefaultAsync(token);
                if (cacheData != null)
                {
                    return Convert.ToString(cacheData);
                }

                var query = DecryptStringAES(token);
                _ = _factory.CacheManager.GetCache("RawSql").SetAsync(token, query, TimeSpan.FromDays(30));
                return query;
            }

            private string DecryptStringAES(string cipherText)
            {
                var keybytes = Encoding.UTF8.GetBytes("0608198627072011");
                var iv = Encoding.UTF8.GetBytes("0608198627072011");

                var encrypted = Convert.FromBase64String(cipherText);
                var decriptedFromJavascript = DecryptStringFromBytes(encrypted, keybytes, iv);
                return string.Format(decriptedFromJavascript);
            }
            private string DecryptStringFromBytes(byte[] cipherText, byte[] key, byte[] iv)
            {
                // Check arguments.  
                if (cipherText == null || cipherText.Length <= 0)
                {
                    throw new ArgumentNullException("cipherText");
                }
                if (key == null || key.Length <= 0)
                {
                    throw new ArgumentNullException("key");
                }
                if (iv == null || iv.Length <= 0)
                {
                    throw new ArgumentNullException("key");
                }

                // Declare the string used to hold  
                // the decrypted text.  
                string plaintext = null;

                // Create an RijndaelManaged object  
                // with the specified key and IV.  
                using (var rijAlg = new RijndaelManaged())
                {
                    //Settings  
                    rijAlg.Mode = CipherMode.CBC;
                    rijAlg.Padding = PaddingMode.PKCS7;
                    rijAlg.FeedbackSize = 128;

                    rijAlg.Key = key;
                    rijAlg.IV = iv;

                    // Create a decrytor to perform the stream transform.  
                    var decryptor = rijAlg.CreateDecryptor(rijAlg.Key, rijAlg.IV);

                    try
                    {
                        // Create the streams used for decryption.  
                        using (var msDecrypt = new MemoryStream(cipherText))
                        {
                            using (var csDecrypt = new CryptoStream(msDecrypt, decryptor, CryptoStreamMode.Read))
                            {

                                using (var srDecrypt = new StreamReader(csDecrypt))
                                {
                                    // Read the decrypted bytes from the decrypting stream  
                                    // and place them in a string.  
                                    plaintext = srDecrypt.ReadToEnd();
                                }
                            }
                        }
                    }
                    catch
                    {
                        plaintext = "keyError";
                    }
                }
                return plaintext;
            }
        }
    }
}
