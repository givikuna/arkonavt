package editor

type CursorPointer struct {
	X int
	Y int
}

type Cursor interface {
	GetPosition() (x int, y int)
	SetPosition(x int, y int, buffer Buffer)
	Clamp(buffer Buffer)

	MoveLeft(buffer Buffer)
	MoveRight(buffer Buffer)
	MoveUp(buffer Buffer)
	MoveDown(buffer Buffer)
}

func NewCursor(x int, y int) *CursorPointer {
	return &CursorPointer{X: x, Y: y}
}

func (c *CursorPointer) GetPosition() (x int, y int) {
	return c.X, c.Y
}

func (c *CursorPointer) SetPosition(x int, y int, buffer Buffer) {
	c.X = x
	c.Y = y
	c.Clamp(buffer)
}

func (c *CursorPointer) Clamp(buffer Buffer) {
	if c.Y < 0 {
		c.Y = 0
	} else if c.Y >= buffer.LineCount() {
		c.Y = buffer.LineCount() - 1
	}

	lineLen := len(buffer.GetLine(c.Y))

	if c.X < 0 {
		c.X = 0
	} else if c.X > lineLen {
		c.X = lineLen
	}
}

func (c *CursorPointer) MoveLeft(buffer Buffer) {
	if c.X > 0 {
		c.X--
	} else if c.Y > 0 {
		c.Y--
		c.X = len(buffer.GetLine(c.Y))
	}
}

func (c *CursorPointer) MoveRIght(buffer Buffer) {
	lineLength := len(buffer.GetLine(c.Y))

	if c.X < lineLength {
		c.X++
	} else if c.Y < buffer.LineCount()-1 {
		c.Y++
		c.X = 0
	}
}

func (c *CursorPointer) MoveUp(buffer Buffer) {
	if c.Y > 0 {
		c.Y--

		lineLength := len(buffer.GetLine(c.Y))
		if c.X > lineLength {
			c.X = lineLength
		}
	}
}

func (c *CursorPointer) MoveDown(buffer Buffer) {
	if c.Y < buffer.LineCount()-1 {
		c.Y++

		lineLength := len(buffer.GetLine(c.Y))
		if c.X > lineLength {
			c.X = lineLength
		}
	}
}
