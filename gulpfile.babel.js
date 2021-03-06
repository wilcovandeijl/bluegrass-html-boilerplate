import gulp from 'gulp'
import runSequence from 'run-sequence'
import requireDir from 'require-dir'

export const STAGE = 'STAGE'
export const RELEASE = 'RELEASE'
export const DEV = 'DEV'

export let env = DEV

export function output () {
  return (env === DEV || env === STAGE) ? './www' : './Release'
}

import notify from 'gulp-notify'

export function handleErrors () {
  const args = Array.from(arguments)

  // Send error to notification center with gulp-notify
  notify.onError({
    title: 'Compile Error',
    message: '<%= error.message %>'
  }).apply(this, args)

  // Keep gulp from hanging on this task
  this.emit('end')
}

requireDir('./gulp')

gulp.task('_build', ['styles', 'static', 'scripts', 'docs'])

gulp.task('default', cb => {
  env = DEV
  runSequence('clean', '_build', 'serve', 'watch', cb)
})

gulp.task('release', cb => {
  env = RELEASE
  runSequence('_build', cb)
})

gulp.task('stage', cb => {
  env = STAGE
  runSequence('clean', '_build', 'serve', 'watch', cb)
})
