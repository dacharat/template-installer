import commander from 'commander'

commander
  .arguments('<name>')
  .description('Create new library')
  .action((name: string) => {
    console.log(name)
  })

commander.parse(process.argv)
