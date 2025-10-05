import React from "react";
import Layout from "../components/Layout";
import Carousel from "../components/Carousel";
import Categories from "../components/Categories";

const Home = () => {
  return (
    <Layout>
      <Carousel/>
      <Categories/>
    </Layout>
  );
};

export default Home;
