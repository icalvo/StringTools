import { Handler } from '@netlify/functions'
import { render } from 'lilynode'
export const handler: Handler = async (event, context) => {
    const svg: Buffer = await render(
        "\\score {    {    \\clef bass    < c' g\\harmonic >4    }  \\layout {        ragged-right = ##t    \\context {        \\Staff      \\omit TimeSignature      \\omit BarLine        }    }}", // Content of a LilyPond file
        { format: "svg" },
    )

    return {
        statusCode: 200,
        headers: {'Content-type' : 'image/svg+xml'},
        body: svg.toString('base64'),
        isBase64Encoded : true,
    }
}
