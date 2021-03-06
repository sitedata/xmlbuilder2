import $$ from '../TestHelpers'
import { useNamespaces } from "xpath"

describe('Replicate issue', () => {

  // https://github.com/oozcitak/xmlbuilder2/issues/8
  test('#8 - xpath on native object does not work', () => {
    const doc = $$.create({ version: "1.0", encoding: "utf-8" })
      .ele("myns:root", { "xmlns:myns": "http://www.google.com/myns/" })
        .ele("myns:child1")
        .txt(`child1_value`)
      .up()
        .ele("myns:child1")
        .txt(`child1_value`)
      .up()
      .doc()

    const select = useNamespaces({
      myns: "http://www.google.com/myns/"
    })
      
    const result = select("//myns:child1", doc.node as any) as any
    expect(result.length).toBe(2)
    expect(result[0].tagName).toBe("myns:child1")
    expect(result[1].tagName).toBe("myns:child1")
  })

  test('#8 - correct usage', () => {
    const doc = $$.create({ version: "1.0", encoding: "utf-8" })
      .ele("http://www.google.com/myns/", "myns:root")
        .ele("http://www.google.com/myns/", "myns:child1")
        .txt(`child1_value`)
      .up()
        .ele("http://www.google.com/myns/", "myns:child1")
        .txt(`child1_value`)
      .up()
      .doc()

    const select = useNamespaces({
      myns: "http://www.google.com/myns/"
    })
      
    const result = select("//myns:child1", doc.node as any) as any
    expect(result.length).toBe(2)
    expect(result[0].tagName).toBe("myns:child1")
    expect(result[1].tagName).toBe("myns:child1")
    expect(doc.end({ prettyPrint: true })).toBe($$.t`
      <?xml version="1.0" encoding="utf-8"?>
      <myns:root xmlns:myns="http://www.google.com/myns/">
        <myns:child1>child1_value</myns:child1>
        <myns:child1>child1_value</myns:child1>
      </myns:root>
    `)
  })

  test('#8 - same with parser', () => {
    const doc = $$.create({ version: "1.0", encoding: "utf-8" })
      .ele("myns:root", { "xmlns:myns": "http://www.google.com/myns/" })
        .ele("myns:child1")
        .txt(`child1_value`)
      .up()
        .ele("myns:child1")
        .txt(`child1_value`)
      .up()

    const doc2 = $$.create(doc.toString());

    const select = useNamespaces({
      myns: "http://www.google.com/myns/"
    })
    select("//myns:child1", doc2.node as any);
      
    const result = select("//myns:child1", doc2.node as any) as any
    expect(result.length).toBe(2)
    expect(result[0].tagName).toBe("myns:child1")
    expect(result[1].tagName).toBe("myns:child1")
  })
})
