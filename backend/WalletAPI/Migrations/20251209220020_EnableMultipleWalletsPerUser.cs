using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WalletAPI.Migrations
{
    /// <inheritdoc />
    public partial class EnableMultipleWalletsPerUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_WalletItems_Wallets_UserWalletId",
                table: "WalletItems");

            migrationBuilder.DropIndex(
                name: "IX_Wallets_UserId",
                table: "Wallets");

            migrationBuilder.DropIndex(
                name: "IX_WalletItems_UserWalletId_Symbol",
                table: "WalletItems");

            migrationBuilder.DropIndex(
                name: "IX_Transactions_CreatedAt",
                table: "Transactions");

            migrationBuilder.DropIndex(
                name: "IX_Transactions_FromUserId_ToUserId_Symbol",
                table: "Transactions");

            migrationBuilder.DropColumn(
                name: "UserWalletId",
                table: "WalletItems");

            migrationBuilder.AlterColumn<Guid>(
                name: "Id",
                table: "Wallets",
                type: "TEXT",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "INTEGER")
                .OldAnnotation("Sqlite:Autoincrement", true);

            migrationBuilder.AddColumn<Guid>(
                name: "WalletId",
                table: "WalletItems",
                type: "TEXT",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<Guid>(
                name: "TargetWalletId",
                table: "Transactions",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "WalletId",
                table: "Transactions",
                type: "TEXT",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_Wallets_UserId",
                table: "Wallets",
                column: "UserId");

            migrationBuilder.Sql(@"
            DELETE FROM WalletItems
            WHERE Id NOT IN (
                SELECT MIN(Id)
                FROM WalletItems
                GROUP BY WalletId, Symbol
                );
            ");

            migrationBuilder.CreateIndex(
                name: "IX_WalletItems_WalletId_Symbol",
                table: "WalletItems",
                columns: new[] { "WalletId", "Symbol" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Transactions_TargetWalletId",
                table: "Transactions",
                column: "TargetWalletId");

            migrationBuilder.CreateIndex(
                name: "IX_Transactions_WalletId_CreatedAt",
                table: "Transactions",
                columns: new[] { "WalletId", "CreatedAt" });

            migrationBuilder.AddForeignKey(
                name: "FK_WalletItems_Wallets_WalletId",
                table: "WalletItems",
                column: "WalletId",
                principalTable: "Wallets",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_WalletItems_Wallets_WalletId",
                table: "WalletItems");

            migrationBuilder.DropIndex(
                name: "IX_Wallets_UserId",
                table: "Wallets");

            migrationBuilder.DropIndex(
                name: "IX_WalletItems_WalletId_Symbol",
                table: "WalletItems");

            migrationBuilder.DropIndex(
                name: "IX_Transactions_TargetWalletId",
                table: "Transactions");

            migrationBuilder.DropIndex(
                name: "IX_Transactions_WalletId_CreatedAt",
                table: "Transactions");

            migrationBuilder.DropColumn(
                name: "WalletId",
                table: "WalletItems");

            migrationBuilder.DropColumn(
                name: "TargetWalletId",
                table: "Transactions");

            migrationBuilder.DropColumn(
                name: "WalletId",
                table: "Transactions");

            migrationBuilder.AlterColumn<int>(
                name: "Id",
                table: "Wallets",
                type: "INTEGER",
                nullable: false,
                oldClrType: typeof(Guid),
                oldType: "TEXT")
                .Annotation("Sqlite:Autoincrement", true);

            migrationBuilder.AddColumn<int>(
                name: "UserWalletId",
                table: "WalletItems",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Wallets_UserId",
                table: "Wallets",
                column: "UserId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_WalletItems_UserWalletId_Symbol",
                table: "WalletItems",
                columns: new[] { "UserWalletId", "Symbol" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Transactions_CreatedAt",
                table: "Transactions",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_Transactions_FromUserId_ToUserId_Symbol",
                table: "Transactions",
                columns: new[] { "FromUserId", "ToUserId", "Symbol" });

            migrationBuilder.AddForeignKey(
                name: "FK_WalletItems_Wallets_UserWalletId",
                table: "WalletItems",
                column: "UserWalletId",
                principalTable: "Wallets",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
