import { Component } from 'react';

import './App.css';
import { Button } from './components/Button';
import { Posts } from './components/Posts';
import { TextInput } from './components/TextInput';

import { loadPosts } from './utils/load-posts'

class App extends Component {
  state = {
    counter: 0,
    posts: [],
    allPosts:[],
    page: 0,
    postsPerPage: 10,
    searchValue: ''
  };
  
async componentDidMount() {
    await this.loadPosts();
  }

  loadPosts = async() =>{
    const{page, postsPerPage} = this.state;
    const postsAndPhotos = await loadPosts();
    this.setState({ 
      posts: postsAndPhotos.slice(page, postsPerPage),
      allPosts: postsAndPhotos,  
    });
  }

  loadMorePosts = () => {
      const{
        page,
        postsPerPage,
        allPosts,
        posts     
      } = this.state;
      const nextPage = page + postsPerPage;
      const nextPosts = allPosts.slice(nextPage, nextPage + postsPerPage);
      posts.push(...nextPosts);

      this.setState ({ posts, page: nextPage});
  }
  handleChange = (e) => {
    const{value} = e.target;
    this.setState({ searchValue: value });
  }

  render() {
    const { posts, page, postsPerPage, allPosts, searchValue } = this.state;
    const noMorePosts = page + postsPerPage >= allPosts.length;

    const filterPosts = !!searchValue ?
    posts.filter(post =>{
      return post.title.toLowerCase().includes(searchValue.toLowerCase()
      );
    })
    : posts;

    return (
      <section className="container">
        <div class = "search-container">

          {!!searchValue && (            
              <h1>Search value: {searchValue}</h1>            
          )}  

          <TextInput searchValue={searchValue} handleChange={this.handleChange}/>
         </div>

        {filterPosts.length > 0 && (
           <Posts posts={filterPosts} />
        )}  
        {filterPosts.length === 0 && (
          <p> Nada foi encontrado </p>
        )}     
        
          
        <div className="button-container">
        {!searchValue && (
            <Button 
            text= "Load more Posts"
            onClick={this.loadMorePosts}
            disabled={noMorePosts}
            />
        )}        
        </div>

      </section>
    );
  }
}
export default App;