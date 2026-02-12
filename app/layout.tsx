import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "./components/Header";
import Footer from "./components/Footer";
import "./globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    metadataBase: new URL("https://demarche-facile-60.vercel.app/"),

    title: {
        default: "Démarche Facile – Aide pour vos démarches administratives",
        template: "%s | Démarche Facile",
    },

    description:
        "Besoin d’aide pour vos démarches administratives ? Carte d’identité, passeport, permis, carte grise… Découvrez les documents nécessaires et trouvez les services publics près de chez vous.",

    keywords: [
        "démarches administratives",
        "aide administrative",
        "documents carte identité",
        "documents passeport",
        "refaire carte identité",
        "mairie proche",
        "services publics",
        "administration française",
        "papiers administratifs",
    ],

    authors: [{ name: "Guillaume SERE" }],
    creator: "Guillaume SERE",
    publisher: "Démarche Facile",

    openGraph: {
        title: "Démarche Facile – Simplifiez vos démarches administratives",
        description:
            "Trouvez rapidement les documents nécessaires pour vos démarches et localisez les services publics autour de vous.",
        url: "https://demarche-facile-60.vercel.app/",
        siteName: "Démarche Facile",
        locale: "fr_FR",
        type: "website",
    },

    twitter: {
        card: "summary_large_image",
        title: "Démarche Facile – Assistant administratif",
        description:
            "Tous les documents nécessaires pour vos démarches administratives + services publics près de vous.",
    },

    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },

    category: "administration",
};


export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="fr">
            <head>
                <meta name="google-site-verification" content="nwVPqsKRGvHVh9v-Qn4QoawQzNbN99Sfg6usOSlUEhg" />
                <link rel="icon" href="/favicon.ico" />
                <meta name="theme-color" content="#2563eb" />
            </head>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <Header />
                {children}
                <Footer />
            </body>
        </html>
    );
}
