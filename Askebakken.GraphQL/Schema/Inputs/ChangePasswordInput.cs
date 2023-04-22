namespace Askebakken.GraphQL.Schema.Inputs;

public record ChangePasswordInput(string Username, string OldPassword, string NewPassword);