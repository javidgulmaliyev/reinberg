import * as _ from "../index.js";

const config = {
  path: {
    src: `${_.path.src}/scss/*.scss`,
    watch: `${_.path.src}/scss/**/*.scss`,
    dest: `${_.path.dest}/css`,
  },
  modules: {
    plumber: {
      errorHandler: _.notify.onError(error => ({
        message: error.message,
      })),
    },
    sass: _.gulpSass(_.sass),
    sassOptions: {
      // silenceDeprecations: ["import",],
    },
    rename: {
      suffix: ".min",
    },
    postcss: [
      _.sortMediaQueries(),
    ],
    lightningcss: (isMinify, addVendorPrefixes) => {
      return _.through2.obj((file, encode, callback) => {
        if (file.isBuffer()) {
          const transformOptions = {
            filename: file.path,
            code: file.contents,
            minify: isMinify,
            sourceMap: false,
            exclude: _.Features.LogicalProperties | _.Features.DirSelector,
          }

          const result = _.transform(addVendorPrefixes ? {
            ...transformOptions,
            targets: _.browserslistToTargets(_.browserslist("defaults")),
          } : {
            ...transformOptions,
          });

          file.contents = result.code;
        }

        callback(null, file);
      });
    }
  },
};

const scss = {
  ["del-css"]() {
    return _.del([`${_.path.dest}/css`]);
  },
  ["scss-dev"]() {
    return _.gulp.src(config.path.src, { encoding: false, allowEmpty: true, })
      .pipe(_.plumber(config.modules.plumber))
      .pipe(config.modules.sass(config.modules.sassOptions))
      .pipe(_.rename(config.modules.rename))
      .pipe(_.gulp.dest(config.path.dest));
  },
  ["scss-prod"]() {
    return _.gulp.src(config.path.src, { encoding: false, allowEmpty: true, })
      .pipe(_.plumber(config.modules.plumber))
      .pipe(config.modules.sass(config.modules.sassOptions))
      .pipe(_.postcss(config.modules.postcss))
      .pipe(config.modules.lightningcss(false, true))
      .pipe(_.gulp.dest(config.path.dest))
      .pipe(_.rename(config.modules.rename))
      .pipe(config.modules.lightningcss(true, false))
      .pipe(_.gulp.dest(config.path.dest));
  },
};

const scssWatch = config.path.watch;
const scssDevTask = scss["scss-dev"];
const scssProdTask = scss["scss-prod"];
const scssTask = _.gulp.series(scss["del-css"], scssProdTask, _.zipTask);

export { scssWatch, scssDevTask, scssProdTask, scssTask };
