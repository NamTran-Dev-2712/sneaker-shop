using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class ExternalAuthProviderConfiguration : IEntityTypeConfiguration<ExternalAuthProvider>
{
    public void Configure(EntityTypeBuilder<ExternalAuthProvider> builder)
    {
        builder.ToTable("external_auth_providers");

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Provider).IsRequired();

        builder.Property(e => e.ProviderUserId).IsRequired().HasMaxLength(256);

        builder.Property(e => e.Email).HasMaxLength(256);

        // Unique index: one provider user per provider
        builder.HasIndex(e => new { e.Provider, e.ProviderUserId }).IsUnique();

        // Index for quick lookups by account
        builder.HasIndex(e => e.AccountId);

        // Relationship to Account
        builder
            .HasOne(e => e.Account)
            .WithMany(a => a.ExternalAuthProviders)
            .HasForeignKey(e => e.AccountId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
