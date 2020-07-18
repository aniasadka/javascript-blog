'use strict';

{

  const templates = {
    articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
    authorLink: Handlebars.compile(document.querySelector('#templates-authorLink').innerHTML),
    tagLink: Handlebars.compile(document.querySelector('#templates-tagLink').innerHTML),
    tagCloudLink: Handlebars.compile(document.querySelector('#templates-tagCloudLink').innerHTML),
    authorCloudLink: Handlebars.compile(document.querySelector('#templates-authorCloudLink').innerHTML)
  }

  const opt = {
    articleSelector: '.post',
    titleSelector: '.post-title',
    titleListSelector: '.titles',
    articleTagsSelector: '.post-tags .list',
    articleAuthorSelector: '.post-author',
    tagsListSelector: '.tags.list',
    cloudClassCount: '5',
    cloudClassPrefix: 'tag-size-',
    authorsListSelector: '.list.authors'
  };

  const titleClickHandler = function (event) {
    event.preventDefault();

    const clickedElement = this;
    const activeLinks = document.querySelectorAll('.titles a.active');

    for (let activeLink of activeLinks) {
      activeLink.classList.remove('active');
    }

    clickedElement.classList.add('active');

    const activeArticles = document.querySelectorAll('.posts article.active');

    for (let activeArticle of activeArticles) {
      activeArticle.classList.remove('active');
    }

    const articleSelector = clickedElement.getAttribute('href');
    const targetArticle = document.querySelector(articleSelector);
    targetArticle.classList.add('active');
  };

  function generateTitleLinks(customSelector = '') {
    const titleList = document.querySelector(opt.titleListSelector);
    const articles = document.querySelectorAll(opt.articleSelector + customSelector);

    let html = '';

    for (let article of articles) {

      const articleId = article.getAttribute('id');
      const articleTitle = article.querySelector(opt.titleSelector).innerHTML;

      const linkHTMLData = {
        id: articleId,
        title: articleTitle
      };
      const linkHTML = templates.articleLink(linkHTMLData);

      html += linkHTML;
    }

    titleList.innerHTML = html;


    const links = document.querySelectorAll('.titles a');

    for (let link of links) {
      link.addEventListener('click', titleClickHandler);
    }

  }

  generateTitleLinks();

  function calculateTagsParams(tags) {
    const params = {
      max: 0,
      min: 999999
    };

    for (let tag in tags) {
      console.log(tag + ' is used ' + tags[tag] + 'times');
      params.max = Math.max(tags[tag], params.max);
      params.min = Math.min(tags[tag], params.min);
    }

    return params;
  }

  function calculateTagClass(count, params) {

    const normalizedCount = count - params.min;
    const normalizedMax = params.max - params.min;
    const percentage = normalizedCount / normalizedMax;
    const classNumber = Math.floor(percentage * (opt.cloudClassCount - 1) + 1);

    return opt.cloudClassPrefix;
  }


  function generateTags() {
    let allTags = {};

    const articles = document.querySelectorAll('.post');

    for (let article of articles) {
      article.classList.contains('post');

      const titleList = article.querySelector(opt.articleTagsSelector);
      let html = '';
      const articleTags = article.getAttribute('data-tags');
      const articleTagsArray = articleTags.split(' ');

      for (let tag of articleTagsArray) {
        const linkHTMLData = {
          id: tag,
          title: tag
        };
        const TagHTMLLink = templates.tagLink(linkHTMLData);

        if (!allTags[tag]) {
          allTags[tag] = 1;
        } else {
          allTags[tag]++;
        }

        titleList.innerHTML = titleList.innerHTML + TagHTMLLink;
      }

    }

    const tagList = document.querySelector('.tags');
    const tagsParams = calculateTagsParams(allTags);

    const allTagsData = {
      tags: []
    };

    for (let tag in allTags) {
      allTagsData.tags.push({
        tag: tag,
        count: allTags[tag],
        className: calculateTagClass(allTags[tag], tagsParams)
      });

    }

    tagList.innerHTML = templates.tagCloudLink(allTagsData);

    addClickListenersToTags();

  }

  generateTags();

  function tagClickHandler(event) {
    event.preventDefault();
    const clickedElement = this;
    const href = clickedElement.getAttribute('href');
    const tag = href.replace('#tag-', '');
    const activeTagLinks = document.querySelectorAll('a.active[href^="#tag-"]');

    for (let activeTagLink of activeTagLinks) {
      activeTagLink.classList.remove('active');
    }

    const equalHrefTagLinks = document.querySelectorAll('a[href="' + href + '"]');

    for (let equalHrefTagLink of equalHrefTagLinks) {
      equalHrefTagLink.classList.add('active');
    }

    generateTitleLinks('[data-tags~="' + tag + '"]');

  }

  function addClickListenersToTags() {
    const links = document.querySelectorAll('.post-tags a, .list.tags a');

    for (let link of links) {
      link.addEventListener('click', tagClickHandler);
    }
  }

  addClickListenersToTags();

  function calculateAuthorsParams(authors) {
    const params = {
      max: 0,
      min: 999999
    };

    for (let author in authors) {
      params.max = Math.max(authors[author], params.max);
      params.min = Math.min(authors[author], params.min);
    }

    return params;
  }

  function calculateAuthorClass(count, params) {

    const normalizedCount = count - params.min;
    const normalizedMax = params.max - params.min;
    const percentage = normalizedCount / normalizedMax;
    const classNumber = Math.floor(percentage * (opt.cloudClassCount - 1) + 1);

    return opt.cloudClassPrefix;
  }

  function generateAuthors() {
    const allAuthors = {};
    const articles = document.querySelectorAll(opt.articleSelector);

    for (let article of articles) {

      const authorWrapper = article.querySelector(opt.articleAuthorSelector);
      const articleAuthors = article.getAttribute('data-author');

      const linkHTMLData = {
        id: articleAuthors,
        title: articleAuthors
      };
      const authorHTMLLink = templates.authorLink(linkHTMLData);

      if (!allAuthors[articleAuthors]) {
        allAuthors[articleAuthors] = 1;
      } else {
        allAuthors[articleAuthors]++;
      }

      authorWrapper.innerHTML = authorHTMLLink;
    }

    const authorsList = document.querySelector(opt.authorsListSelector);
    const authorsParams = calculateAuthorsParams(allAuthors);

    const allAuthorsData = {
      authors: []
    };

    for (let author in allAuthors) {
      allAuthorsData.authors.push({
        author: author,
        count: allAuthors[author],
        className: calculateAuthorClass(allAuthors[author], authorsParams)
      });

    }


    authorsList.innerHTML = templates.authorCloudLink(allAuthorsData);

  }

  generateAuthors();

  function authorClickHandler(event) {
    event.preventDefault();
    const clickedElement = this;
    const href = clickedElement.getAttribute('href');
    const author = href.replace('#author-', '');

    generateTitleLinks('[data-author="' + author + '"]');

  }

  function addClickListenersToAuthors() {
    const links = document.querySelectorAll('.post-author a, .list.authors a');

    for (let link of links) {
      link.addEventListener('click', authorClickHandler);
    }
    /* END LOOP: for each link */
  }

  addClickListenersToAuthors();

}
