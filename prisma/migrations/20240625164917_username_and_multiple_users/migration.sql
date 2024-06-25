BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[companies] (
    [company_id] INT NOT NULL IDENTITY(1,1),
    [company_rfc] NVARCHAR(12) NOT NULL,
    [name] NVARCHAR(500) NOT NULL,
    [prefix] NVARCHAR(5),
    [emails] NVARCHAR(max),
    [isDeletable] BIT NOT NULL CONSTRAINT [companies_isDeletable_df] DEFAULT 1,
    [isDeleted] BIT NOT NULL CONSTRAINT [companies_isDeleted_df] DEFAULT 0,
    CONSTRAINT [companies_pk] PRIMARY KEY CLUSTERED ([company_id]),
    CONSTRAINT [companies_company_rfc_uindex] UNIQUE NONCLUSTERED ([company_rfc])
);

-- CreateTable
CREATE TABLE [dbo].[invoices] (
    [uuid] NVARCHAR(36) NOT NULL,
    [provider_id] INT NOT NULL,
    [company_id] INT NOT NULL,
    [xml_path] NVARCHAR(200) NOT NULL,
    [pdf_path] NVARCHAR(200) NOT NULL,
    [isDeleted] BIT NOT NULL CONSTRAINT [invoices_isDeleted_df] DEFAULT 0,
    [invoice_date] DATETIME2 NOT NULL,
    [certification_timestamp] DATETIME2 NOT NULL,
    [reference] NVARCHAR(255) NOT NULL,
    [document_type_id] NVARCHAR(1000) NOT NULL,
    [user_load] INT NOT NULL,
    CONSTRAINT [invoices_pk] PRIMARY KEY CLUSTERED ([uuid])
);

-- CreateTable
CREATE TABLE [dbo].[user_types] (
    [user_type_id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(50) NOT NULL,
    CONSTRAINT [user_types_pk] PRIMARY KEY CLUSTERED ([user_type_id])
);

-- CreateTable
CREATE TABLE [dbo].[providers] (
    [provider_id] INT NOT NULL IDENTITY(1,1),
    [provider_rfc] NVARCHAR(12) NOT NULL,
    [name] NVARCHAR(500) NOT NULL,
    [email] NVARCHAR(500) NOT NULL,
    [zipcode] INT,
    [isDeleted] BIT NOT NULL CONSTRAINT [providers_isDeleted_df] DEFAULT 0,
    CONSTRAINT [providers_pk] PRIMARY KEY CLUSTERED ([provider_id]),
    CONSTRAINT [providers_provider_rfc_key] UNIQUE NONCLUSTERED ([provider_rfc])
);

-- CreateTable
CREATE TABLE [dbo].[users] (
    [user_id] INT NOT NULL IDENTITY(1,1),
    [username] NVARCHAR(500) NOT NULL,
    [email] NVARCHAR(500) NOT NULL,
    [password] NVARCHAR(300) NOT NULL,
    [name] NVARCHAR(500) NOT NULL,
    [user_type_id] INT NOT NULL,
    [otp] INT,
    [otp_expire_date] DATETIME2,
    [isActive] BIT NOT NULL CONSTRAINT [users_isActive_df] DEFAULT 1,
    CONSTRAINT [users_pk] PRIMARY KEY CLUSTERED ([user_id])
);

-- CreateTable
CREATE TABLE [dbo].[users_providers] (
    [user_id] INT NOT NULL,
    [provider_id] INT NOT NULL,
    CONSTRAINT [users_providers_pkey] PRIMARY KEY CLUSTERED ([user_id],[provider_id])
);

-- CreateTable
CREATE TABLE [dbo].[document_types] (
    [document_type_id] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(50) NOT NULL,
    CONSTRAINT [document_types_pk] PRIMARY KEY CLUSTERED ([document_type_id])
);

-- AddForeignKey
ALTER TABLE [dbo].[invoices] ADD CONSTRAINT [invoices_document_types_document_type_id_fk] FOREIGN KEY ([document_type_id]) REFERENCES [dbo].[document_types]([document_type_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[invoices] ADD CONSTRAINT [invoices_companies_company_id_fk] FOREIGN KEY ([company_id]) REFERENCES [dbo].[companies]([company_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[invoices] ADD CONSTRAINT [invoices_providers_provider_id_fk] FOREIGN KEY ([provider_id]) REFERENCES [dbo].[providers]([provider_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[invoices] ADD CONSTRAINT [invoices_users_user_id_fk] FOREIGN KEY ([user_load]) REFERENCES [dbo].[users]([user_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[users] ADD CONSTRAINT [FK__users__user_type__17CF3C3F] FOREIGN KEY ([user_type_id]) REFERENCES [dbo].[user_types]([user_type_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[users_providers] ADD CONSTRAINT [users_providers_users_user_id_fk] FOREIGN KEY ([user_id]) REFERENCES [dbo].[users]([user_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[users_providers] ADD CONSTRAINT [users_providers_providers_provider_id_fk] FOREIGN KEY ([provider_id]) REFERENCES [dbo].[providers]([provider_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
