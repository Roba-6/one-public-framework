import '@/common/styles/components/atoms/text-image.css'

import React from 'react'

const building = `
.\n\n|\n\n|\n\n=\n\n=\n\n#\n\nif\n\n()\n\nelse\n\nexit\n\nwec\n\nsldkjwermern\n
kslji977we42hwer-----\n\nsldkjwermxbn\n\nsldkjw\n\nhijklsadkfjweryex\n
jflk  sldk  lsder\n\nlsdjflkjslkdfjl\n\nelse  heri  hsd\n\nsdjfhklwehrllks\n
9r3s  heri  hsdre\n\nsdjfhklwehrllksrd\n\nvar\n\nsrdklsdfjhi934sd896dsf896sf\n
3k48sdf6{wer()l;redux;react\n\n7sd9function9break90sdf0asd\n\n7sd9func99xa9d\n
7sd9f0sdf0asd\n\nfines\n\nserval\n\nsdlkfj\n\nsdlfkjf\n\nweryoiu\n\nw]p235l\n
jwnere\n\nwerjhp\n\nsdfkj\n\n  = |\n\n  = \\\n\n  =  \\\n\nif|elif{\n\n  =   |\n
  =   \\\n\n  =    |\n\nes|jwer088r\n\n  =     |\n\n  =     \\\n\n  =      |\n
we|y9d{sfhw}n\n\n  =      /\n\n  =     |\n\n  =     |\n\nlk|jwer088r\n\n  =    /\n
  =   |\n\n  =   |\n\nld|break\n\n  =  /\n\n  = |\n\n7sd9funcdeewer\n\nksioweruy;srd\n
sk9e7sdf8{sn\n\nvar____\n\nsk9e7sdfs\n\nj934nsflkje|\n\nweis8124csterrs\n
nsdfwlk9sdf90esers\n\n9e7sdfelk9sdf90esersd\n\n9e7sdfelk9jnweresewerner\n
9elkwrn,mxcysexesersdx23\n\n9e7sdfelk9sdf90esersd\n\nslkewrh\n\nslkewrh\n
sdkfjwleksflkjrwerne;.       e\n\nsldkjf  rslk  wlek  erer====|ds--|-----\n
werlkjlwkerlsk756wer/.       L\n\nsdfsf\n\nexit\n\nbreak\n\nsernsldsdf\n
lkwer86xansdflkw9;{sjw7\n\nsernl  jrns  n,mns  wsf\n\nsdjweri9xdf7124j;lksdf8\n
lkjwd d96 fde h1\n\nlksdf hjs dkn g2\n\njwernsdmf,hkhads\n\nsern\n
werjiosyh{sdkjfwern\n\njwn  oiys  nctiera\n\njsd64kx6fs0d967de\n\ndwd   fd    x\n
lkwernx,mcfkjhsdfsd\n\nwer tci tsd fut hjlk\n\nwer gsd twe urt usadf\n
werhgxicutisduft93hxcf\n\nsdfwwerwer\n\nsdfw123x\n\nsdd23\n\nwersdker\n
sdkljfwesdfwerwersfs)\n\nsdklf  keww  jklw  rkjlklj)\n
er2234256werweslkdfjlk   kjews+\n\nsdklf  keww  fsdf  jsdflkh)\n
lksdjfkxkjbwerlkjlsf)\n\nerwserns\n\nsdfjw\n\nwerns\n\nlkjs\n\nlkjf\n\nskd\n\nwer\n
slkdfjwerty\n\nlkjwe  sdfb\n\njsldfweiroysdfoioisydfe--\n\njwler  sdjh  iy90  kl3\n
jsldfweiroysdfoioisydf\n\njwler  sdjh  iy90  kl3\n\njsldfweiroysdfoioisydfe--\n
wernd  woei\n\nwerbsdfb97s\n\nsfioy\n\njsdlfkjlwkerhosidfyois98w6rs98f\n
lskdfj89  sfsa  owei  7sfj  khd\n\nlskdfj8967sfsajfoweir67sfjslkhd\n
d7s     ||    ||    ||    ||\n\njsdlfkjlwkerhosidfyois98w6rs98f\n
lskdfj89  sfsa  owei  7sfj  khd\n\nlskdfj8967sfsajfoweir67sfjslkhd\n\nlske\n
jklwerbnsf907;\n\nwrh3 ernd kjsd\n\nersc back kjsd\n\nlkjwr90x7d0s9;\n\nsfwerwer\n
elkj f97\n\nwerh jsf\n\nwerndsm;\n\nsdf\n\nwer\n\ncst\n\ngo\n\nj\n\nd\n\n8\n\n4\n\n|\n
`

/**
 * TextImage is a functional React component that renders a container with a textual
 * representation inside a code block and a specified number of child elements
 * styled as 'bird'.
 *
 * The component uses `Array.map()` to dynamically generate a list of child elements
 * based on a fixed length.
 *
 * @returns {React.ReactNode} A JSX element that includes a styled container with
 * text and dynamic child elements.
 */
const TextImage = (): React.ReactNode => {
  return (
    <div className="text-image">
      <pre>
        <code>{building}</code>
      </pre>
      {Array.from({ length: 3 }).map((_: unknown, idx: number) => (
        <div key={idx} className="bird" />
      ))}
    </div>
  )
}

export default TextImage
