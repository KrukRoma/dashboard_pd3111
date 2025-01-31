import {useEffect, useState} from "react";
import {Button, Card, CardActions, CardContent, CardMedia, Grid, Pagination, Typography, MenuItem, Select, InputLabel, FormControl, Chip, Box} from "@mui/material";
import axios from "axios";

const NewsPage = () => {
    const [news, setNews] = useState({articles: [], totalResults: 0});
    const [pagination, setPagination] = useState({page: 1, count: 1});
    const [selectedTopics, setSelectedTopics] = useState(["ukraine"]); 

    const apiKey = "eef038525fa7401d8dfe7cf1a9006b10";
    const lang = "uk";
    const pageSize = 20;  

    const topics = [
        "ukraine", "world", "technology", "business", "sports", 
        "health", "entertainment", "science", "politics", "education"
    ];

    const changePageHandler = (event, value) => {
        setPagination((prev) => {
            const newPagination = {...prev, page: value};
            newsRequest(newPagination);
            return newPagination;
        });
    }

    const topicChangeHandler = (event) => {
        setSelectedTopics(event.target.value);
        setPagination({...pagination, page: 1});  
    }

    const newsRequest = async (pagination) => {
        const query = selectedTopics.join(" OR ");
        const url = `https://newsapi.org/v2/everything?apiKey=${apiKey}&q=${query}&language=${lang}&pageSize=${pageSize}&page=${pagination.page}`;

        const response = await axios.get(url);
        setNews(response.data);
        
        const pageCount = Math.ceil(response.data.totalResults / pageSize);
        setPagination({...pagination, count: pageCount});
    }

    useEffect(() => {
        if (selectedTopics.length > 0) {
            newsRequest(pagination);
        }
        window.scrollTo(0, 0);
    }, [pagination.page, selectedTopics]); 

    return (
        <>
            <FormControl fullWidth sx={{ marginBottom: 2 }}>
                <InputLabel id="topic-select-label">Choose Topics</InputLabel>
                <Select
                    labelId="topic-select-label"
                    multiple
                    value={selectedTopics}
                    label="Choose Topics"
                    onChange={topicChangeHandler}
                    renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                            {selected.map((value) => (
                                <Chip key={value} label={value} sx={{ margin: 0.5 }} />
                            ))}
                        </Box>
                    )}
                >
                    {topics.map((topic) => (
                        <MenuItem key={topic} value={topic}>
                            {topic}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <div style={{display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "20px", marginTop: "20px"}}>
                {
                    news.articles.map((article) => (
                        <Grid size={3} key={article.publishedAt}>
                            <Card sx={{maxWidth: 345, height: "100%"}}>
                                <CardMedia
                                    sx={{height: 140}}
                                    image={article.urlToImage}
                                    title={article.title}
                                />
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="div">
                                        {article.title}
                                    </Typography>
                                    <Typography variant="body2" sx={{color: 'text.secondary'}}>
                                        {article.description}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <a href={article.url}>
                                        <Button size="small">Learn More</Button>
                                    </a>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))
                }
            </div>

            <div style={{display: "flex", justifyContent: "center", padding: "15px"}}>
                <Pagination 
                    color="primary" 
                    page={pagination.page} 
                    count={pagination.count} 
                    onChange={changePageHandler}
                />
            </div>
        </>
    )
}

export default NewsPage;
