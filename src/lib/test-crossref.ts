import { searchCrossrefArticles } from "./articles";

async function run() {
    console.log("Searching for 'deadlock in os'...");
    const articles = await searchCrossrefArticles("deadlock in os");
    console.log(`Found ${articles.length} articles.`);
    if (articles.length > 0) {
        console.log("First article:");
        console.log(articles[0]);
    }
}

run();
