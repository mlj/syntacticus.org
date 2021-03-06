<template>
  <div>
    <script type="application/ld+json">
    {
      "@context": "http://schema.org",
      "@type": "Organization",
      "url": "http://syntacticus.org",
      "name": "Syntacticus",
      "logo": "http://syntacticus.org/logo-large.png",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "http://syntacticus.org/tokens?form={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    }
    </script>

    <section class="hero is-light">
      <div class="hero-body">
        <div class="content has-text-centered">
          <h1 class="title is-2">Syntacticus</h1>
          <p></p>
          <p></p>
          <p class="subtitle is-4">A treebank of early Indo-European languages</p>

          <p>
          <router-link to='/browse' class="button is-primary is-large"><span>Browse</span></router-link>
          </p>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="columns is-multiline">
          <div class="column is-one-third has-text-centered">
            <div class="content">
              <p>
                <a href="http://www.bl.uk/catalogues/illuminatedmanuscripts/ILLUMIN.ASP?Size=mid&IllID=8641">
                  <img src="../assets/plough.jpg"
                     class="is-square"
                     style="border: 1px solid black"
                     alt="Detail of a miniature with a man holding a hammer or mallet, Burney 272 f. 18, The British Library (Public Domain)">
                </a>
              </p>

              <h3 class="subtitle is-4">Rigorous</h3>
              <p>
                Every sentence has been annotated by hand and verified by trained linguists. The annotation schema is inspired by Lexical Functional Grammar and is the same for all the languages.
              </p>
            </div>
          </div>
          <div class="column is-one-third has-text-centered">
            <div class="content">
              <p>
                <a href="http://www.bl.uk/catalogues/illuminatedmanuscripts/ILLUMIN.ASP?Size=mid&IllID=8643">
                  <img src="../assets/beehive.jpg"
                     class="is-square"
                     style="border: 1px solid black"
                     alt="Detail of a miniature of a beehive, Burney 272 f. 43v, The British Library (Public Domain)">
                </a>
              </p>

              <h3 class="subtitle is-4">Comprehensive</h3>
              <p>
                Syntacticus contains one million words from early Indo-European languages with complete morphological and syntactic analysis, and it is still growing.
              </p>
            </div>
          </div>
          <div class="column is-one-third has-text-centered">
            <div class="content">
              <p>
                <a href="http://www.bl.uk/catalogues/illuminatedmanuscripts/ILLUMIN.ASP?Size=mid&IllID=8642">
                  <img src="../assets/grapes.jpg"
                     class="is-square"
                     style="border: 1px solid black"
                     alt="Detail of a miniature with a man picking grapes, Burney 272 f. 26, The British Library (Public Domain)">
                </a>
              </p>

              <h3 class="subtitle is-4">Open Source</h3>
              <p>
                Syntacticus is open source, free and developer-friendly. Do you want to analyse the raw data yourself? No problem, get it from our repositories.
              </p>
            </div>
          </div>
        </div>
        <div class="columns is-multiline">
          <div class="column has-text-centered">
          <a href="http://dev.syntacticus.org/" class="button is-primary"><span>Learn more</span></a>
          </div>
        </div>
      </div>
    </section>

    <section class="hero is-light">
      <div class="hero-body">
        <div class="container">
          <div class="columns">
            <div class="column is-half">
              <div class="image is-2by1">
                <a href="https://commons.wikimedia.org/wiki/File:Terence_Andria_1.1_Vat3868f4v.jpg"><img src="../assets/ms-vaticana.png"></a>
              </div>
            </div>
            <div class="column is-one-third is-offset-1">
              <h1 class="title">
                Classical texts
              </h1>
              <h2 class="subtitle">
                Syntacticus includes well-known Classical literature in Latin and Ancient Greek, like
                <router-link to='/source/29'>Caesar's <em>Gallic War</em></router-link> and
                <router-link to='/source/34'>Herodotus' <em>Histories</em></router-link>.
                It also contains a substantial collection of texts in old Slavonic languages.
              </h2>
              <p>
                <router-link :to="{ name: 'source', params: { gid: 'proiel:20170214:caes-gal' }}" class="button is-primary"><span>Explore</span></router-link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="hero is-dark">
      <div class="hero-body">
        <div class="container">
          <div class="columns is-tablet">
            <div class="column is-third">
              <h1 class="title">
                Parallel Biblical texts
              </h1>
              <h2 class="subtitle">
                Syntacticus includes the New Testament in Ancient Greek and its translations into Latin, Gothic, Old Church Slavonic and Classical Armenian. Because these texts are translations you can browse them side-by-side and see how each word has been translated.
              </h2>
              <p>
                <router-link :to="{ name: 'aligned_source', params: { gid: 'proiel:20170214:latin-nt' }}" class="button is-primary is-outlined"><span>Explore</span></router-link>
              </p>
            </div>
            <div class="column is-half is-offset-1">
              <div class="image is-2by1">
                <a href="https://commons.wikimedia.org/wiki/File:Wulfila_bibel.jpg"><img src="../assets/ms-wulfila.png"></a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
