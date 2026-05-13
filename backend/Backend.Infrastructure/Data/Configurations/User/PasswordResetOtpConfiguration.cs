using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class PasswordResetOtpConfiguration : IEntityTypeConfiguration<PasswordResetOtp>
{
    public void Configure(EntityTypeBuilder<PasswordResetOtp> builder)
    {
        builder.ToTable("password_reset_otps");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.AccountId).IsRequired();

        builder.Property(x => x.EmailSnapshot).IsRequired().HasMaxLength(255);

        builder.Property(x => x.OtpHash).IsRequired().HasMaxLength(128);

        builder.Property(x => x.ExpiresAt).IsRequired();

        builder.Property(x => x.ResendAvailableAt).IsRequired();

        builder.Property(x => x.AttemptCount).IsRequired().HasDefaultValue(0);

        builder.Property(x => x.ConsumedAt).IsRequired(false);

        builder.Property(x => x.CreatedAt).IsRequired().HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(x => x.UpdatedAt).IsRequired().HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.HasIndex(x => x.AccountId);
        builder.HasIndex(x => x.ExpiresAt);
        builder.HasIndex(x => x.ConsumedAt);
        builder.HasIndex(x => new { x.AccountId, x.CreatedAt });

        builder
            .HasOne(x => x.Account)
            .WithMany(a => a.PasswordResetOtps)
            .HasForeignKey(x => x.AccountId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
