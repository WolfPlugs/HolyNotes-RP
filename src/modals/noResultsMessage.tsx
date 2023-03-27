import { webpack } from 'replugged'

const classes = {
  ...webpack.getByProps('emptyResultsWrap'),
}

export default ({ error }) => {

  if (error) console.log(error)
  if (error) {
    return (
      <div className={classes.emptyResultsWrap}>
        <div className={classes.emptyResultContent} style={{ paddingBottom: '0px' }}>
          <div className={classes.errorImage} />
          <div className={classes.emptyResultstext}>
            There was an error parsing your notes! The issue was logged in your console, press CTRL + I to access it! Please visit the support server if you need extra help!
          </div>
        </div>
      </div>
    )
  } else if (Math.floor(Math.random() * 100) <= 10) {
    return (
      <div className={classes.emptyResultsWrap}>
        <div className={classes.emptyResultsContent} style={{ paddingBottom: '0px' }}>
          <div className={`${classes.noResultsImage} ${classes.alt}`} />
          <div className={classes.emptyResultsText}>
            No notes were found. Empathy banana is here for you.
          </div>
        </div>
      </div>
    )
  } else {
    return (
      <div className={classes.emptyResultsWrap}>
        <div className={classes.emptyResultsContent} style={{ paddingBottom: '0px' }}>
          <div className={classes.noResultsImage} />
          <div className={classes.emptyResultsText}>
            No notes were found saved in this notebook.
          </div>
        </div>
      </div>
    )
  }
}
