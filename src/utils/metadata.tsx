import Head from "next/head";

export default function Metadata({ title, description }: { title: string, description: string }) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
    </Head>
  );
}
