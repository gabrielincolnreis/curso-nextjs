import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";

interface IProduct {
  id: string;
  title: string;
}

interface CategoryProps {
  products: IProduct[];
}

export default function Category({ products }: CategoryProps) {
  const router = useRouter();

  if (router.isFallback) {
    return <p>Carregando...</p>;
  }

  return (
    <div>
      <h1>{router.query.slug}</h1>

      <ul>
        {products.map((product) => {
          return <li key={product.id}>{product.title}</li>;
        })}
      </ul>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch(`http://localhost:3333/categories`);
  const categories = await response.json();

  const paths = categories.map((category) => {
    return {
      params: { slug: category.id }, //o fato de ser slug é por ser o mesmo nome da pagina
    };
  });
  return {
    paths,
    fallback: true,
    //Toda vez que uma rota diferente for chamada ele irá tentar buscar por essa rota.
  };
};

//Como que o build irá "pensar" preciso executar uma página dinamica, por utilizar o [slug]
//de uma forma estática.
//Ele rendeniza todas as categorias

export const getStaticProps: GetStaticProps<CategoryProps> = async (
  context
) => {
  const { slug } = context.params;

  const response = await fetch(
    `http://localhost:3333/products?category_id=${slug}`
  );
  const products = await response.json();

  return {
    props: {
      products,
    },
    revalidate: 60,
    //A cada 5 segundos ele faz uma chamada a API.
  };
};
