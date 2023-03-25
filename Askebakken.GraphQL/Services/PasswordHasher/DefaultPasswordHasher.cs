using System.Security.Authentication;
using System.Security.Cryptography;

namespace Askebakken.GraphQL.Services.PasswordHasher;

public class DefaultPasswordHasher : IPasswordHasher, IDisposable
{
    private const int SALT_SIZE = 16;
    private const int HASH_SIZE = 20;
    
    private RandomNumberGenerator _randomNumberGenerator = RandomNumberGenerator.Create();
    private HashAlgorithmName _hashAlgorithmName;

    /// <summary>
    /// Create a new default password hasher.
    /// </summary>
    /// <param name="hashAlgorithmName">The hashing algorithm to use - defaults to SHA256.</param>
    public DefaultPasswordHasher(HashAlgorithmName? hashAlgorithmName = null)
    {
        _hashAlgorithmName = hashAlgorithmName ?? HashAlgorithmName.SHA256;
    }

    public string Hash(string password)
    {
        byte[] salt;
        _randomNumberGenerator.GetBytes(salt = new byte[SALT_SIZE]);
        
        var pbkdf2 = new Rfc2898DeriveBytes(password, salt, 100000, _hashAlgorithmName);
        byte[] hash = pbkdf2.GetBytes(HASH_SIZE);
        
        byte[] hashBytes = new byte[SALT_SIZE + HASH_SIZE];
        Array.Copy(salt, 0, hashBytes, 0, SALT_SIZE);
        Array.Copy(hash, 0, hashBytes, SALT_SIZE, HASH_SIZE);

        return Convert.ToBase64String(hashBytes);
    }

    public bool Verify(string password, string hash)
    {
        byte[] hashBytes = Convert.FromBase64String(hash);
        byte[] salt = new byte[SALT_SIZE];
        Array.Copy(hashBytes, 0, salt, 0, SALT_SIZE);
        
        var pbkdf2 = new Rfc2898DeriveBytes(password, salt, 100000, _hashAlgorithmName);
        byte[] inputPasswordHash = pbkdf2.GetBytes(HASH_SIZE);
        for (int i=0; i < HASH_SIZE; i++)
            if (hashBytes[i + SALT_SIZE] != inputPasswordHash[i])
                return false;
        return true;
    }

    public void Dispose()
    {
        _randomNumberGenerator.Dispose();
        GC.SuppressFinalize(this);
    }
}