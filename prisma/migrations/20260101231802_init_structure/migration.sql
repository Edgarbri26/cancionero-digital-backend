-- CreateTable
CREATE TABLE "songs" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "artist" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "url_song" TEXT,
    "categoryId" INTEGER NOT NULL,

    CONSTRAINT "songs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "roleId" INTEGER NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "misa" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "dateCreate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateMisa" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "misa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "moment" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,

    CONSTRAINT "moment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "missa_song" (
    "id" SERIAL NOT NULL,
    "misaId" INTEGER NOT NULL,
    "songId" INTEGER NOT NULL,
    "momentId" INTEGER,
    "key" VARCHAR(10),

    CONSTRAINT "missa_song_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "moment_nombre_key" ON "moment"("nombre");

-- AddForeignKey
ALTER TABLE "songs" ADD CONSTRAINT "songs_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "missa_song" ADD CONSTRAINT "missa_song_misaId_fkey" FOREIGN KEY ("misaId") REFERENCES "misa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "missa_song" ADD CONSTRAINT "missa_song_songId_fkey" FOREIGN KEY ("songId") REFERENCES "songs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "missa_song" ADD CONSTRAINT "missa_song_momentId_fkey" FOREIGN KEY ("momentId") REFERENCES "moment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
